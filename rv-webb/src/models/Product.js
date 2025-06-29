import sequelize from '../../sequelize-instance.js';
import { DataTypes } from 'sequelize';

const Product = sequelize.define('rv_product', {
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
  }, {
    sequelize,
    tableName: 'rv_product',
    schema: 'public',
    timestamps: false
});

export default Product;