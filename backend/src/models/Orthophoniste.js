module.exports = (sequelize, DataTypes) => {
  const Orthophoniste = sequelize.define('Orthophoniste', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.TEXT
    },
    city: {
      type: DataTypes.STRING
    },
    postalCode: {
      type: DataTypes.STRING(10)
    },
    profilePictureUrl: {
      type: DataTypes.STRING
    },
    doctolibUrl: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'Orthophonistes'
  });

  Orthophoniste.associate = (models) => {
    Orthophoniste.hasMany(models.Patient, {
      foreignKey: 'orthophonisteId',
      as: 'patients'
    });
  };

  return Orthophoniste;
};
