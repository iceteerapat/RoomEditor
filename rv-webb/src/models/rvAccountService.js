import sequelize from '../../sequelize-instance.js';
import { DataTypes } from 'sequelize';

const AccountService = sequelize.define('rv_account_service', {
  recId: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'rec_id'
  },
  customerId: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'customer_id'
  },
  serviceName: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'service_name'
  },
  serviceAccess: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: 'service_access'
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'service_id'
  },
  imageGenerated: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'image_generated'
  },
  createDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'create_date'
  }
}, {
  sequelize,
  tableName: 'rv_account_service',
  schema: 'public',
  timestamps: false
});

export default AccountService;
