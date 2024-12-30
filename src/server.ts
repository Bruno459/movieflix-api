import express from 'express';

const app = express();
const port = 3000

app.get('/movies', (req, res) => {
    res.send('Listagem de filmes');
})

app.listen(port, () => {
    console.log(`servidor está rodando em http://localhost:${port}/`);
})