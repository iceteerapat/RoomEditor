import sequelize from '../../sequelize-instance.js';
import { DataTypes } from 'sequelize';

const Service = sequelize.define('rv_service', {
    recId: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'rec_id'
    },
    customerId: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'customer_id'
    },
    stripeCustomerId: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'stripe_customer_id'
    },
    productName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'product_name'
    },
    productAccess: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'product_access'
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id'
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'credits'
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'create_date'
    }
  }, {
    sequelize,
    tableName: 'rv_service',
    schema: 'public',
    timestamps: false
});

export default Service;