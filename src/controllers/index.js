// Route handlers for static pages
const homePage = (req, res) => {
    // res.addStyle('<link rel="stylesheet" href="/css/main.css">', 10);
    // res.addScript('<script src="/js/server.js"></script>', 5);
    // return only one res
    res.render('home', { title: 'Home' });
};

const aboutPage = (req, res) => {
    res.render('about', { title: 'About' });
};

const demoPage = (req, res) => {
    res.render('demo', { title: 'Middleware Demo Page' });
};

const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

export { homePage, aboutPage, demoPage, testErrorPage };