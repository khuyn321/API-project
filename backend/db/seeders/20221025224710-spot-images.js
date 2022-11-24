'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = "SpotImages";

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
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://picsum.photos/200/300',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://picsum.photos/500/580',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://picsum.photos/1800/200',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://picsum.photos/2412/479',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://picsum.photos/592/786',
        preview: true
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
    await queryInterface.bulkDelete(options, {});
  }
};
