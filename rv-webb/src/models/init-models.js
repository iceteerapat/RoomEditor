import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _SequelizeMeta from  "./SequelizeMeta.js";
import _rv_account from  "./rv_account.js";
import _rv_account_login from  "./rv_account_login.js";
import _rv_account_service from  "./rv_account_service.js";
import _rv_service from  "./rv_service.js";

export default function initModels(sequelize) {
  const SequelizeMeta = _SequelizeMeta.init(sequelize, DataTypes);
  const rv_account = _rv_account.init(sequelize, DataTypes);
  const rv_account_login = _rv_account_login.init(sequelize, DataTypes);
  const rv_account_service = _rv_account_service.init(sequelize, DataTypes);
  const rv_service = _rv_service.init(sequelize, DataTypes);


  return {
    SequelizeMeta,
    rv_account,
    rv_account_login,
    rv_account_service,
    rv_service,
  };
}
