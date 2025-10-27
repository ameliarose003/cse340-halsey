/**
 * Helper function to get the current greeting based on the time of day.
 */
const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
        return 'Good Morning!';
    }

    if (currentHour < 18) {
        return 'Good Afternoon!';
    }

    return 'Good Evening!';
};

/**
 * Helper function to set all expected res.locals values
 */
const setLocalVariables = (req, res) => {
    // Randomly assign a theme class to the body
    const themes = ['blue-theme', 'green-theme', 'red-theme'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    res.locals.bodyClass = randomTheme;

    // Set current year for use in templates
    res.locals.currentYear = new Date().getFullYear();

    // Set greeting based on time of day
    res.locals.greeting = `<p>${getCurrentGreeting()}</p>`;

    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

    // Make req.query available to all templates
    res.locals.queryParams = { ...req.query };

    // Convenience variable for UI state based on session state
    res.locals.isLoggedIn = false;
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
    }
};

/**
 * Express middleware that adds head asset management functionality to routes.
 * Provides arrays for storing CSS and JS assets with priority support.
 * 
 * Adds these methods to the response object:
 * - res.addStyle(css, priority) - Add CSS/link tags to head
 * - res.addScript(js, priority) - Add script tags 
 * 
 * Adds these functions to EJS templates via res.locals:
 * - renderStyles() - Outputs all CSS in priority order (high to low)
 * - renderScripts() - Outputs all JS in priority order (high to low)
 * 
 * @example
 * // In route handlers
 * res.addStyle('<link rel="stylesheet" href="/css/page.css">', 10);
 * res.addScript('<script src="/js/app.js"></script>', 5);
 * 
 * // In EJS templates
 * <head>
 *   <%- renderStyles() %>
 * </head>
 * <body>
 *   <%- renderScripts() %>
 * </body>
 */
const setHeadAssetsFunctionality = (res) => {
    res.locals.styles = [];
    res.locals.scripts = [];

    res.addStyle = (css, priority = 0) => {
        res.locals.styles.push({ content: css, priority });
    };

    res.addScript = (js, priority = 0) => {
        res.locals.scripts.push({ content: js, priority });
    };

    // These functions will be available in EJS templates
    res.locals.renderStyles = () => {
        return res.locals.styles
            // Sort by priority: higher numbers come first (b - a = descending)
            // Example: priority 20 comes before priority 10
            .sort((a, b) => b.priority - a.priority)
            // Extract just the HTML content from each object
            // Changes [{content: '<link...>', priority: 10}] to ['<link...>']
            .map(item => item.content)
            // Join all HTML strings together with newlines between them
            .join('\n');
    };

    res.locals.renderScripts = () => {
        return res.locals.scripts
            // Sort by priority: higher numbers come first (b - a = descending)
            // Example: priority 20 comes before priority 10  
            .sort((a, b) => b.priority - a.priority)
            // Extract just the HTML content from each object
            // Changes [{content: '<script...>', priority: 5}] to ['<script...>']
            .map(item => item.content)
            // Join all HTML strings together with newlines between them
            .join('\n');
    };
};

const globalMiddleware = (req, res, next) => {
    // Configure res.locals for our applications needs
    setLocalVariables(req, res);

    // Allow adding scripts and styles to a view dynamically and easily
    setHeadAssetsFunctionality(res);

    // Continue to the next middleware or route handler
    next();
};

export {globalMiddleware};