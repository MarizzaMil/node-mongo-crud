const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

const heroSchema = new db.Schema({
  name: String,
  superPower: String,
});

const Hero = db.model('Hero', heroSchema); // Define the Hero model

// Create a new hero
app.post('/heroes', async (req, res) => {
  const { name, superPower } = req.body;

  try {
    const hero = await Hero.create({ name, superPower });
    res.status(201).json(hero);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating hero' });
  }
});

// Get all heroes
app.get('/heroes', async (req, res) => {
  try {
    const heroes = await Hero.find();
    res.status(200).json(heroes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching heroes' });
  }
});

// Get a hero by ID
app.get('/heroes/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const hero = await Hero.findById(id);
    if (!hero) {
      res.status(404).json({ message: 'Hero not found' });
    } else {
      res.status(200).json(hero);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching hero' });
  }
});

// Update a hero by ID
app.put('/heroes/:id', async (req, res) => {
  const id = req.params.id;
  const { name, superPower } = req.body;

  try {
    const hero = await Hero.findByIdAndUpdate(id, { name, superPower }, { new: true });
    if (!hero) {
      res.status(404).json({ message: 'Hero not found' });
    } else {
      res.status(200).json(hero);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating hero' });
  }
});

// Delete a hero by ID
app.delete('/heroes/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Hero.findByIdAndDelete(id);
    if (!result) {
      res.status(404).json({ message: 'Hero not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting hero' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
