const authModel = require("../models/authModel");

function registerUser(req, res, next) {
  authModel.registerUser(req, res, next);
}

function login(req, res, next) {
  authModel.loginUser(req, res, next);
}

function logout(req, res, next) {
  authModel.logout(req, res, next);
}

module.exports = {
  registerUser,
  login,
  logout,
};
