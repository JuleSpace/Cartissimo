const express = require('express')
const router = express.Router()
const { Orthophoniste } = require('../models')

// GET /api/orthophonistes
router.get('/', async (req, res) => {
  try {
    const orthos = await Orthophoniste.findAll({
      order: [['lastName', 'ASC']]
    })
    res.json(orthos)
  } catch (err) {
    console.error('Erreur récupération orthophonistes :', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

module.exports = router
