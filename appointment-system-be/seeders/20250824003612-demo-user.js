'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'user1',
        username: 'user1',
        preferred_timezone: 'Asia/Jakarta',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user2',
        username: 'user2',
        preferred_timezone: 'Pacific/Jayapura',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
