'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = "Bookings";

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
        spotId: 5,
        userId: 3,
        startDate: '2023-11-19',
        endDate: '2023-11-24'
      },
      {
        spotId: 5,
        userId: 5,
        startDate: '2023-01-10',
        endDate: '2023-01-14'
      },
      {
        spotId: 1,
        userId: 2,
        startDate: '2022-12-20',
        endDate: '2022-12-25'
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '2023-04-01',
        endDate: '2023-04-05'
      },
      {
        spotId: 2,
        userId: 4,
        startDate: '2023-02-10',
        endDate: '2023-02-14'
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
