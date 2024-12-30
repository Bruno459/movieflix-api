import { PrismaClient } from '@prisma/client';
import express from 'express';

const app = express();
const port = 3000
const prisma = new PrismaClient();

app.get('/movies', async (req, res) => {
    const movie = await prisma.movie.findMany();
    res.json(movie);
})

app.listen(port, () => {
    console.log(`servidor está rodando em http://localhost:${port}/`);
})