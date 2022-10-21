'use strict';
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [
      {
        email: 'demo@user.io',
        username: 'DaBestDemoUser',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user@demo.com',
        username: 'yaBoyDemoReelzz',
        hashedPassword: bcrypt.hashSync('wordpass')
      },
      {
        email: 'pyrocynical@gmail.com',
        username: 'mrPyrocynical',
        hashedPassword: bcrypt.hashSync('Pword123')
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', {
      username: {
        [Op.in]: ['DaBestDemoUser', 'yaBoyDemoReelzz', 'mrPyrocynical']
      }
    });
  }
};
