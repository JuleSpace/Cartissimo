const { Orthophoniste, Patient, Session } = require('../models');
const { Sequelize } = require('sequelize');

const orthoController = {
  getOrthophonisteDashboard: async (req, res) => {
    const orthoId = req.params.id;

    try {
      const ortho = await Orthophoniste.findByPk(orthoId);
      if (!ortho) return res.status(404).json({ message: 'Orthophoniste introuvable' });

      const patients = await Patient.findAll({
        where: { orthophonisteId: orthoId },
        attributes: {
          include: [
            [
              Sequelize.literal(`(
                SELECT COUNT(*) 
                FROM Sessions AS s 
                WHERE s.patientId = Patient.id AND s.status = 'completed'
              )`),
              'completedSessions'
            ]
          ]
        }
      });

      res.json({ orthophoniste: ortho, patients });
    } catch (error) {
      console.error('Erreur dashboard orthophoniste:', error);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = orthoController;
