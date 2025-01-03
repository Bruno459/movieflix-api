/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';
import express from 'express';
import swaggerUi from'swagger-ui-express';
import swaggerDocument from '../swagger.json';

const app = express();
const port = 3000
const prisma = new PrismaClient();

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

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

app.post("/movies", async (req, res) => {
    const { title, genre_id, language_id, oscar_count, release_date } = req.body;

    try {

        const movieWithSameTitle = await prisma.movie.findFirst({
            where: {
                title: { equals: title, mode: "insensitive" }
            },
        });

        if (movieWithSameTitle) {
            return res.status(409).send({ message: "Já existe um filme com esse título" });
        }

        await prisma.movie.create({
            data: {
                title,
                genre_id,
                language_id,
                oscar_count,
                release_date: new Date(release_date),
            },
        });
    } catch (err) {
        return res.status(500).send({ message: "Falha ao cadastrar um filme" });
    }

    res.status(201).send();
});

app.put('/movies/:id', async (req, res) => {
    const id = Number(req.params.id);

    try {
        const movie = await prisma.movie.findUnique({
            where: {
                id
            }
        });

        if (!movie) {
            return res.status(404).send({ message: "Filme não encontrado" });
        }

        const data = { ...req.body };
        data.release_date = data.release_date ? new Date(data.release_date) : undefined;

        await prisma.movie.update({
            where: {
                id: id
            },
            data: data
        });

        res.status(200).send();
    } catch (err) {
        return res.status(500).send({ message: "Falha ao atualizar o registro do filme" });
    }
});

app.delete('/movies/:id', async (req, res) => {
    const id = Number(req.params.id);

    try {
        const movie = await prisma.movie.findUnique({ where: { id } })

        if (!movie) {
            return res.status(404).send({ message: "O filme não foi encontrado" })
        }

        await prisma.movie.delete({ where: { id } });
    } catch (err) {
        return res.status(500).send({ message: "Não foi possível remover o filme" })
    }

    res.status(200).send();
});

app.get('/movies/:genreName', async (req, res) => {
    try {
        const moviesFilteredByGenreName = await prisma.movie.findMany({
            where: {
                genres: {
                    name: {
                        equals: req.params.genreName,
                        mode: "insensitive"
                    }
                }
            },
            include: {
                genres: true,
                languages: true,
            }
        })

        res.status(200).send(moviesFilteredByGenreName);

    } catch (err) {
        res.status(500).send({ message: "Falha ao filtrar filmes por gênero" })
    }
})

app.listen(port, () => {
    console.log(`servidor está rodando em http://localhost:${port}/`);
})