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
    serviceName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'service_name'
    },
    serviceUsage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'service_usage'
    }
  }, {
    sequelize,
    tableName: 'rv_service',
    schema: 'public',
    timestamps: false
});

export default Service;