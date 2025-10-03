import express from 'express';
import path from 'path';
import { title } from 'process';
import { fileURLToPath } from 'url'; // Why do I need this??? It is needed because __fileName and __dirname aren't built-in

// Derive __dirname for ES Modules: Why do I need this?? Same reason as above
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

const app = express();


app.use((req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();
    next();
});

app.use((req, res, next) => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
        res.locals.currentHour = "Good Morning"
    }
    else if (currentHour >= 12 && currentHour < 17) {
        res.locals.currentHour = "Good Afternoon"
    }
    else {
        res.locals.currentHour = "Good Night"
    }
        next();
});

app.use((req, res, next) => {
    const themes = ['blue-theme', 'green-theme', 'red-theme'];

    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    res.locals.bodyClass = randomTheme;

    next();
});

app.use((req, res, next) => {
    res.locals.queryParams = req.query;
    // console.log('Middleware query params:', res.locals.queryparams);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Global Template variables
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';
    next();
});

const addDemoHeaders = (req, res, next) => {
    res.setHeader('X-Demo-Page', 'true');
    res.setHeader('X-Middleware-Demo', 'This is a very intense header')

    next();
}



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));


// Course data - place this after imports, before routes
const courses = {
    'CS121': {
        id: 'CS121',
        title: 'Introduction to Programming',
        description: 'Learn programming fundamentals using JavaScript and basic web development concepts.',
        credits: 3,
        sections: [
            { time: '9:00 AM', room: 'STC 392', professor: 'Brother Jack' },
            { time: '2:00 PM', room: 'STC 394', professor: 'Sister Enkey' },
            { time: '11:00 AM', room: 'STC 390', professor: 'Brother Keers' }
        ]
    },
    'MATH110': {
        id: 'MATH110',
        title: 'College Algebra',
        description: 'Fundamental algebraic concepts including functions, graphing, and problem solving.',
        credits: 4,
        sections: [
            { time: '8:00 AM', room: 'MC 301', professor: 'Sister Anderson' },
            { time: '1:00 PM', room: 'MC 305', professor: 'Brother Miller' },
            { time: '3:00 PM', room: 'MC 307', professor: 'Brother Thompson' }
        ]
    },
    'ENG101': {
        id: 'ENG101',
        title: 'Academic Writing',
        description: 'Develop writing skills for academic and professional communication.',
        credits: 3,
        sections: [
            { time: '10:00 AM', room: 'GEB 201', professor: 'Sister Anderson' },
            { time: '12:00 PM', room: 'GEB 205', professor: 'Brother Davis' },
            { time: '4:00 PM', room: 'GEB 203', professor: 'Sister Enkey' }
        ]
    }
};




// Routes
app.get('/', (req, res) => {
    const title = 'Welcome Home';
    res.render('home', {title});
});

app.get('/about', (req, res) => {
    const title = 'About Me';
    res.render('about', {title});
});

app.get('/products', (req,res) => {
    const title = 'Our Products';
    res.render('products', {title});
})

// Dynamic 
app.get('/params-demo/:color/:food', (req, res) => {
    const title = 'Params Demo';
    // destructuring 
    const {color, food} = req.params;
    res.render('params-demo', {title, color, food});
});

app.get('/middleware-demo', addDemoHeaders, (req, res) => {
    res.render('middleware-demo', {
        title: 'Middleware Demo Page'
    });
});

app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
});

app.get('/catalog', (req, res) => {
    res.render('catalog', {
        title: 'Course Catalog',
        courses: courses
    });
});

app.get('/catalog/:courseId', (req, res, next) => {
    const courseId = req.params.courseId;
    const course = courses[courseId];

    if (!course) {
        const err = new Error(`Course ${courseId} not found`);
        err.status = 404;
        return next(err);
    }

    const sortBy = req.query.sort || 'time';

    let sortedSections = [...course.sections];

    switch (sortBy) {
        case 'professor':
            sortedSections.sort((a, b) => a.professor.localeCompare(b.professor));
            break;
        case 'room':
            sortedSections.sort((a, b) => a.room.localeCompare(b.room));
            break;
        case 'time':
        default:
            break;
    }

    console.log(`Viewing Course: ${courseId}, sorted by: ${sortBy}`);

    res.render('course-detail', {
        title: `${course.id} - ${course.title}`,
        course: {...course, sections: sortedSections},
        currentSort: sortBy
    });
});

// middleware -- It runs on every route. 
// app.use is middleware not a route handler.
// 404


app.use((req, res, next) => {
    const err = new Error('Page not found'); 
    err.status = 404;
    next(err);
});


// Global error handler --- doesn't have to be at the bottom, it can be at the top of the routes and it would still work.
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };

    res.status(status).render(`errors/${template}`, context);

    
    // if (err.status === 404) {
    //     res.status(404).render('404', {title: 'Page Not Found'});
    //     return
    // }

    // res.status(500).render('500', {title: 'Something Went Wrong'});

});


if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort});
        
        wsServer.on('listening', () => {
            console.log(`WebSocket server running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
};

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`)
});