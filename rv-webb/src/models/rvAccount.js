import sequelize from '../../sequelize-instance.js';
import { DataTypes } from 'sequelize';

const Account = sequelize.define('rv_account', {
    recId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'rec_id'
    },
    customerId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'customer_id'
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'create_date'
    }
  }, {
    sequelize,
    tableName: 'rv_account',
    schema: 'public',
    timestamps: false
});
export default Account;
