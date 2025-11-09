/**
 * Middleware to require authentication for protected routes
 * Redirects to login page if user is not authenticated
 * Sets res.locals.isLoggedIn = true for authenticated requests
 */
const requireLogin = (req, res, next) => {
    const user = req.session.user;

    // res.locals.currentUser = user;
    // Check if user is logged in via session
    if (req.session && req.session.user) {
        // User is authenticated - set UI state and continue
        res.locals.isLoggedIn = true;
        res.locals.currentUser = {
            id: user.id,
            role_name: user.role_name
        };
        // const isOwnCard = currentUser.id === user.id;
        // res.locals.isAdmin = currentUser.role_name === 'admin';
        // res.locals.canEdit = isOwnCard || isAdmin;
        // res.locals.canDelete = isAdmin && !isOwnCard;
        return next();
    } else {
        // User is not authenticated - redirect to login
        return res.redirect('/login');
    }
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * Uses flash messages to communicate authorization failures
 * 
 * @param {string} roleName - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (roleName) => {
    return (req, res, next) => {
        // TODO: Check if user is logged in (req.session.user exists)
        const user = req.session.user;
        // If not logged in, set flash message and redirect to /login
        if (!user) {
            // Flash message example:
            req.flash('error', 'You must be logged in to access this page.')
            return res.redirect('/login');

        }

        // TODO: Check if user's role_name matches the required roleName
        const userRole = user.role_name
        // If roles don't match, set flash message and redirect to /
        if (userRole !== roleName) {
            req.flash('error', 'You do not have permission to access this page.')
            return res.redirect('/')
        }

        // TODO: If user has required role, call next() to continue
        next();
    };
};


export { requireLogin , requireRole };