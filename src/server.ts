import { PrismaClient } from '@prisma/client';
import express from 'express';

const app = express();
const port = 3000
const prisma = new PrismaClient();

app.use(express.json());

app.get('/movies', async (_, res) => {
    const movie = await prisma.movie.findMany({
        orderBy: {
            title: 'asc',
        },
        include: {
            genres: true,
            languages: true,
        }
    });
    res.json(movie);
})

app.post('/movies', async (req, res) => {
    const { title, genre_id, language_id, oscar_count, release_date } = req.body;

    try {
        await prisma.movie.create({
            data: {
                title,
                genre_id,
                language_id,
                oscar_count,
                release_date: new Date(release_date),
            }
        });
    } catch (err) {
        return res.status(500).send({message: 'Falha ao cadastrar um filme'})
    }

    res.status(201).send('Filme criado com sucesso');
})

app.listen(port, () => {
    console.log(`servidor está rodando em http://localhost:${port}/`);
})