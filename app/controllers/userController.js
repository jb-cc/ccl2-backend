// require the model



const userModel = require("../models/userModel");


// used to edit the user data, such as the username, email, password, etc.
function editUser(req, res, next) {
  req.body.id = req.auth.id;
  console.log("req.body: " + JSON.stringify(req.body));
  userModel.updateUser(req, res, next);
}

// used to delete the user, is not reversible

function deleteUser(req, res, next) {
  userModel.deleteUser(req, res, next);
}


// used to deposit balance into the user's account.
// Can be repeated infinitely, because the app is not connected to any payment system, and the balance is not real money
function depositBalance(req, res, next) {
  userModel.depositBalance(req, res, next);
}

module.exports = {
  editUser,
  deleteUser,
  depositBalance,
};
