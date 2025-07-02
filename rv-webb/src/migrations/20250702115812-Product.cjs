'use strict';
const { DataTypes } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('rv_product', { 
      recId: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'rec_id'
      },
      productName: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'product_name'
      },
      creditGrant: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'credit_grant'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('rv_product');
  }
};
