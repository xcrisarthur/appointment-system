'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User bisa membuat banyak appointment (sebagai creator)
      this.hasMany(models.Appointment, {
        foreignKey: 'creator_id',
        as: 'createdAppointments'
      });

      // User bisa ikut banyak appointment lewat tabel pivot
      this.belongsToMany(models.Appointment, {
        through: models.AppointmentParticipants,
        foreignKey: 'user_id',
        otherKey: 'appointment_id',
        as: 'appointments'
      });
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    preferred_timezone: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
  });

  return User;
};
