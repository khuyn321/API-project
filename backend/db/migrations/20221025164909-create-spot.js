'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'cascade'
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(85),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      lat: {
        type: Sequelize.DECIMAL(16)
      },
      lng: {
        type: Sequelize.DECIMAL(16)
      },
      name: {
        type: Sequelize.STRING(180),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(1000)
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Spots"
    await queryInterface.dropTable(options);
  }
};