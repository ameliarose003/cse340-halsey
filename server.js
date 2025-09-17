import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Why do I need this???

// Derive __dirname for ES Modules: Why do I need this??
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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


const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`)
})