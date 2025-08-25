'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      // Appointment dimiliki oleh satu User (creator)
      this.belongsTo(models.User, {
        foreignKey: 'creator_id',
        as: 'creator'
      });

      // Appointment punya banyak peserta lewat tabel pivot
      this.belongsToMany(models.User, {
        through: models.AppointmentParticipants,
        foreignKey: 'appointment_id',
        otherKey: 'user_id',
        as: 'participants'
      });
    }
  }

  Appointment.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Appointment',
    tableName: 'Appointments',
  });

  return Appointment;
};
