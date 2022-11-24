'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = "Reviews";

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
        spotId: 3,
        userId: 1,
        review: 'DO NOT STAY HERE!! It was super sketchy and a guy dressed as an old lady stole my purse :(',
        stars: 1,
      },
      {
        spotId: 5,
        userId: 3,
        review: 'Wow. It was so boujee the chandelier was made of diamonds. I\'m broke now though, so 3.5 stars',
        stars: 3.5,
      },
      {
        spotId: 5,
        userId: 5,
        review: 'Absolutely MARVELOUS!! Champagne, free pilates class-- by golly it was a JOLLY fun time it was!',
        stars: 5,
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Pretty nice spot. My family and I stayed here since it was close to Disneyland, and the host was very attentive and accomodating. Would recommend',
        stars: 4,
      },
      {
        spotId: 2,
        userId: 4,
        review: 'Warning: THE PLACE IS ACTUALLY ENTIRELY MADE OF CANDY. I thought it was just a joke but the candy-made pipelines proved to be pretty bad. Chocolate river was really cool though',
        stars: 3.7,
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
