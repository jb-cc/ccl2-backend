// Controller that handles the logic for the authentication routes




// instantiate the model that is used in this controller
const authModel = require("../models/authModel");


// defining the functions that will be used in the routes
// none of these functions are protected with the JWT, as they are used for authentication / checking if the user is logged in or not

function registerUser(req, res, next) {
  authModel.registerUser(req, res, next);
}

function login(req, res, next) {
  authModel.loginUser(req, res, next);
}

function logout(req, res, next) {
  authModel.logout(req, res, next);
}


// checking if the user is logged in or not, if yes, it sends back the user data
function sendBackUser(req, res, next) {
  authModel.sendBackUserDataFromToken(req, res, next);
}

module.exports = {
  registerUser,
  login,
  logout,
  sendBackUser,
};
