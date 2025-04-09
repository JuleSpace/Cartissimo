const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Theme, { 
        through: models.UserTheme,
        foreignKey: 'userId',
        otherKey: 'themeId'
      });
      User.hasMany(models.Patient, {
        foreignKey: 'userId',
        as: 'patients'
      });
      User.belongsToMany(models.Patient, {
        through: 'patient_therapists',
        foreignKey: 'therapistId',
        otherKey: 'patientId',
        as: 'therapistPatients'
      });
      User.hasMany(models.Animation, {
        foreignKey: 'createdBy',
        as: 'animations'
      });
    }

    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'orthophonist', 'parent'),
      allowNull: false,
      defaultValue: 'parent'
    },
    subscriptionRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  return User;
}; 