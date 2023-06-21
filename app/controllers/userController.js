const userModel = require("../models/userModel");

function getUsers(req, res, next) {
  userModel
    .getUsers()
    .then((users) => {
      res.json(users); // this was: res.render('users', {users});
    })
    .catch((err) => {
      res.status(404);
      next(err);
    });
}

function getUser(req, res, next) {
  console.log("req.params.id: " + parseInt(req.params.id));
  userModel
    .getUser(parseInt(req.params.id))
    .then((user) => {
      console.log("typeof user: " + typeof user);
      res.json(user); // this was: res.render('user', {user});
    })
    .catch((err) => {
      res.status(404);
      next(err);
    });
}

function editUser(req, res, next) {
  req.body.id = req.auth.id;
  console.log("req.body: " + JSON.stringify(req.body));
  userModel.updateUser(req, res, next);
}

function deleteUser(req, res, next) {
  userModel.deleteUser(req, res, next);
}

function depositBalance(req, res, next) {
  userModel.depositBalance(req, res, next);
}

module.exports = {
  getUsers,
  getUser,
  editUser,
  deleteUser,
  depositBalance,
};
