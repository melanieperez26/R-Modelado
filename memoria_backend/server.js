// index.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const path = require('path')

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});