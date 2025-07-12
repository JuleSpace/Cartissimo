const express = require('express');
const router = express.Router();
const { ThemeCompletion } = require('../models');

// POST /api/theme-completions
router.post('/', async (req, res) => {
  try {
    console.log('💡 Données reçues dans le POST /theme-completions:', req.body);
    const { userId, themeId } = req.body;

    if (!userId || !themeId) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    const completion = await ThemeCompletion.create({
      userId,
      themeId,
    });

    res.status(201).json(completion);
  } catch (error) {
    console.error('Erreur POST /theme-completions :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
