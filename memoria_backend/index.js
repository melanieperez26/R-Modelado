// index.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

const frontendPath = path.join(__dirname, 'memoria_backend', 'juego_de_memoria');

// Sirve los archivos estáticos
app.use(express.static(frontendPath));

app.use(cors());
app.use(express.json());

// Guardar nuevo usuario y puntaje
app.post('/api/score', async (req, res) => {
  const { name, score } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { name, score }
    });
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar el puntaje' });
  }
});

// Obtener top 10 puntajes
app.get('/api/highscores', async (req, res) => {
  const top = await prisma.user.findMany({
    orderBy: { score: 'desc' },
    take: 10
  });
  res.json(top);
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));