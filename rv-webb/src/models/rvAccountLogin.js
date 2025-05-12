import sequelize from '../../sequelize-instance.js';
import { DataTypes } from 'sequelize';
const AccountLogin = sequelize.define('rv_account_login', {
    recId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'rec_id'
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    verifyPassword: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'verify_password'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    privacyFlag: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'privacy_flag'
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'create_date'
    },
    verifyEmail:{
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'verify_email'
    },
    active:{
      type: DataTypes.STRING(1),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'rv_account_login',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "rv_account_login_pk",
        unique: true,
        fields: [
          { name: "rec_id" },
        ]
      },
    ]
  });
export default AccountLogin;
