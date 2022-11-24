'use strict';
const bcrypt = require('bcryptjs')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = "Users";

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
    await queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'DaBestDemoUser',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Demo',
        lastName: 'User'
      },
      {
        email: 'user@demo.com',
        username: 'yaBoyDemoReelzz',
        hashedPassword: bcrypt.hashSync('wordpass'),
        firstName: 'Demo',
        lastName: 'Reelzz'
      },
      {
        email: 'pyrocynical@gmail.com',
        username: 'mrPyrocynical',
        hashedPassword: bcrypt.hashSync('Pword123'),
        firstName: 'Niall',
        lastName: 'Comas'
      },
      {
        email: 'spidey@spider.man',
        username: 'Spidey',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Peter',
        lastName: 'Parker'
      },
      {
        email: 'maryJane@spider.man',
        username: 'ripmaryjane123',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Mary',
        lastName: 'Jane'
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
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: ['DaBestDemoUser', 'yaBoyDemoReelzz', 'mrPyrocynical', 'Spidey', 'ripmaryjane123']
      }
    });
  }
};
