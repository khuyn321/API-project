'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = "Spots";

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
        ownerId: 1,
        address: '12572 Wakawaka ln',
        city: 'Anaheim',
        state: 'California',
        country: 'United States of America',
        lat: 37.7634281,
        lng: -123.5792573,
        name: 'Luxurious Anaheim Apartment',
        description: 'Really cool, sick place with a great view. Lots of amenities',
        price: 59.99,
      },
      {
        ownerId: 2,
        address: '72379 Willy Wonka rd',
        city: 'FantasyLand',
        state: 'Kansas',
        country: 'United States of America',
        lat: 83.8216418,
        lng: 27.15748,
        name: 'Full Warehouse Made of Candy',
        description: 'If you like candy this is the vacation stay for you!',
        price: 200.99,
      },
      {
        ownerId: 3,
        address: '8135 BackAlley Wy',
        city: 'Sketchy Town',
        state: 'California',
        country: 'United States of America',
        lat: -12.06299,
        lng: -157.43395,
        name: 'Adventurous Gothic Hut',
        description: 'Nestled in a very discreet area surrounded by towering buildings, you\'ll find a VERY thrilling community and stay here!',
        price: 0.99,
      },
      {
        ownerId: 4,
        address: '19236 RockyRoad Rd',
        city: 'Victorville',
        state: 'California',
        country: 'United States of America',
        lat: 79.90436,
        lng: 175.80874,
        name: 'Nice Stay',
        description: 'Nice place',
        price: 12.99,
      },
      {
        ownerId: 5,
        address: '1777 Boujee St',
        city: 'Malibu',
        state: 'California',
        country: 'United States of America',
        lat: -40.63466,
        lng: -84.71524,
        name: 'Super High-Class Unaffordable Luxury Condo',
        description: 'A wonderful, luxurious condo with a gym, pool, perfect view of the ocean, close to the city.',
        price: 3100.99,
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
