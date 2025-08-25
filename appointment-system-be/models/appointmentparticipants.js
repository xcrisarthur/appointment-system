'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AppointmentParticipants extends Model {
    static associate(models) {
      // Relasi ke User
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      // Relasi ke Appointment
      this.belongsTo(models.Appointment, {
        foreignKey: 'appointment_id',
        as: 'appointment'
      });
    }
  }

  AppointmentParticipants.init({
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Appointments',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'AppointmentParticipants',
    tableName: 'AppointmentParticipants',
  });

  return AppointmentParticipants;
};
