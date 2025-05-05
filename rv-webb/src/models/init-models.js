var DataTypes = require("sequelize").DataTypes;
var _rv_customer_acct = require("./rv_customer_acct");

function initModels(sequelize) {
  var rv_customer_acct = _rv_customer_acct(sequelize, DataTypes);


  return {
    rv_customer_acct,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
