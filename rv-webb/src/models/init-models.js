var DataTypes = require("sequelize").DataTypes;
var _rv_account_login = require("./rvAccountLogin");

function initModels(sequelize) {
  var rv_account_login = _rv_account_login(sequelize, DataTypes);


  return {
    rv_account_login,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
