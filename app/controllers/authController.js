const authModel = require("../models/authModel");

function registerUser(req, res, next) {
  authModel.registerUser(req, res, next);
}

function login(req, res, next) {
  authModel.loginUser(req, res, next);
}

module.exports = {
  registerUser,
  login,
};
