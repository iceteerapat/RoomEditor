'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('rv_account_login', {
      recId: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'rec_id'
    },
    username: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    verifyPassword: {
      type: Sequelize.STRING(100),
      allowNull: false,
      field: 'verify_password'
    },
    phone: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    privacyFlag: {
      type: Sequelize.STRING(1),
      allowNull: false,
      field: 'privacy_flag'
    },
    createDate: {
      type: Sequelize.DATE,
      allowNull: false,
      field: 'create_date'
    },
    verifyEmail:{
      type: Sequelize.STRING(1),
      allowNull: false,
      field: 'verify_email'
    },
    active:{
      type: Sequelize.STRING(1),
      allowNull: false
    }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('rv_account_login');
  }
};
