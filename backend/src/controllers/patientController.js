const Patient = require('../models/Patient');

exports.create = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Patient.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedPatient = await Patient.findByPk(req.params.id);
      res.json(updatedPatient);
    } else {
      res.status(404).json({ message: 'Patient non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Patient.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Patient supprimé avec succès' });
    } else {
      res.status(404).json({ message: 'Patient non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 