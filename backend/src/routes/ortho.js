const express = require('express');
const router = express.Router();
const { Orthophoniste, Patient } = require('../models');

// GET /api/orthophonistes — liste des orthophonistes
router.get('/', async (req, res) => {
  try {
    const orthos = await Orthophoniste.findAll({
      order: [['lastName', 'ASC']]
    });
    res.json(orthos);
  } catch (err) {
    console.error('Erreur récupération orthophonistes :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/orthophonistes/:id/dashboard — patients de l’orthophoniste
router.get('/:id/dashboard', async (req, res) => {
  const orthoId = req.params.id;

  try {
    const orthophoniste = await Orthophoniste.findByPk(orthoId, {
      include: [
        {
          model: Patient,
          as: 'patients',
          attributes: [
            'id',
            'firstName',
            'lastName',
            'birthDate',
            'subscriptionStatus',
            'subscriptionEndDate'
          ]
        }
      ],
      attributes: ['id', 'firstName', 'lastName', 'email']
    });

    if (!orthophoniste) {
      return res.status(404).json({ message: 'Orthophoniste non trouvé' });
    }

    const formattedPatients = orthophoniste.patients.map((patient) => ({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthDate: patient.birthDate,
      subscriptionStatus: patient.subscriptionStatus,
      subscriptionEndDate: patient.subscriptionEndDate,
      completedSessions: 0 // ⚠️ à adapter si tu veux les sessions réelles
    }));

    res.json({
      orthophoniste: {
        id: orthophoniste.id,
        firstName: orthophoniste.firstName,
        lastName: orthophoniste.lastName,
        email: orthophoniste.email
      },
      patients: formattedPatients
    });
  } catch (err) {
    console.error('Erreur dashboard orthophoniste :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
