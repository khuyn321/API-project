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
        url: 'https://cdn.discordapp.com/attachments/968410738358120448/1080276309369950269/afternoon.png',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://e0.pxfuel.com/wallpapers/498/799/desktop-wallpaper-artstation-anime-background-art-commissions-ford-nguyen-alley-anime.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://pbs.twimg.com/media/FIMTgS3WYAEeJQQ?format=jpg&name=large',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://preview.redd.it/qgjqyqtsfx7a1.jpg?width=960&crop=smart&auto=webp&v=enabled&s=abf07f6a976e4bdf867f15ac693a615fa77b3561',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://cdnb.artstation.com/p/assets/images/images/000/870/995/large/ivan-tantsiura-sunset-house-001.jpg?1435009351',
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
