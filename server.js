import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Why do I need this??? It is needed because __fileName and __dirname aren't built-in

// Derive __dirname for ES Modules: Why do I need this?? Same reason as above
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';

    next();
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

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
}

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`)
})