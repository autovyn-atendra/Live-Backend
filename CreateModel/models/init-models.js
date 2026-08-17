var DataTypes = require("sequelize").DataTypes;
var _CloudQuery = require("./CloudQuery");
var _CloudWa = require("./CloudWa");
var _DbCon = require("./DbCon");
var _ExpenseApproval = require("./ExpenseApproval");
var _ExpenseApprovalHst = require("./ExpenseApprovalHst");
var _ExpenseApprovalMatrix = require("./ExpenseApprovalMatrix");
var _ExpenseApprovalMatrixHst = require("./ExpenseApprovalMatrixHst");
var _Session = require("./Session");
var _Db1 = require("./Db1");
var _Login = require("./Login");

function initModels(sequelize) {
  var CloudQuery = _CloudQuery(sequelize, DataTypes);
  var CloudWa = _CloudWa(sequelize, DataTypes);
  var DbCon = _DbCon(sequelize, DataTypes);
  var ExpenseApproval = _ExpenseApproval(sequelize, DataTypes);
  var ExpenseApprovalHst = _ExpenseApprovalHst(sequelize, DataTypes);
  var ExpenseApprovalMatrix = _ExpenseApprovalMatrix(sequelize, DataTypes);
  var ExpenseApprovalMatrixHst = _ExpenseApprovalMatrixHst(sequelize, DataTypes);
  var Session = _Session(sequelize, DataTypes);
  var Db1 = _Db1(sequelize, DataTypes);
  var Login = _Login(sequelize, DataTypes);


  return {
    CloudQuery,
    CloudWa,
    DbCon,
    ExpenseApproval,
    ExpenseApprovalHst,
    ExpenseApprovalMatrix,
    ExpenseApprovalMatrixHst,
    Session,
    Db1,
    Login,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
