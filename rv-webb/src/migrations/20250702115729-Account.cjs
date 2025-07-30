'use strict';
const { DataTypes } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('rv_account', { 
      recId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'rec_id'
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      customerId: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'customer_id'
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'username'
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'password'
      },
      verifyPassword: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'verify_password'
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'phone'
      },
      verifyEmail: {
        type: DataTypes.STRING(1),
        allowNull: false,
        field: 'verify_email'
      },
      active: {
        type: DataTypes.STRING(1),
        allowNull: false,
        field: 'active'
      },
      createDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'create_date'
      },
      privacyFlag: {
        type: DataTypes.STRING(1),
        allowNull: false,
        field: 'privacy_flag'
      },
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
