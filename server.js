import express from 'express';

const app = express();

const name = process.env.NAME;

app.get('/', (req, res) => {
    res.send(`Hello, ${name}!`);
});

app.get('/newRoute', (req, res) => {
    res.send('This is a new route!');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`)
})