const db = require("../config/database").config;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

let getUsers = () =>
  new Promise((resolve, reject) => {
    db.query("SELECT * FROM CCL_users", function (err, users, fields) {
      if (err) {
        reject(err);
      }
      console.log("got users: " + users);
      resolve(users);
    });
  });

let getUser = (id) =>
  new Promise((resolve, reject) => {
    console.log("id: " + id);
    db.query(
      `SELECT * FROM CCL_users WHERE id=${id}`,
      function (err, users, fields) {
        if (err) {
          reject(err);
        }
        console.log(`user with id ${id}: ` + JSON.stringify(users[0]));
        resolve(users[0]);
      }
    );
  });

let deleteUser = (req, res, next) =>
  new Promise((resolve, reject) => {
    console.log("req.auth.id: " + req.auth.id);
    req.body.id = parseInt(req.auth.id);
    const id = req.body.id;
    const password = req.body.password;

    const sql = `SELECT * FROM CCL_users WHERE id = ?`;

    db.query(sql, [id], async (err, results) => {
      if (err) {
        console.log(`Error fetching user: ${err.message}`);
        res
          .status(500)
          .json({ message: 'Error fetching user, are you logged in?' });
        return;
      }

      const user = results[0];
      console.log("user: " + JSON.stringify(user));

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("password is incorrect");
        res.status(400).json({ message: "Password is incorrect" });
        return;
      }
      console.log("password is correct");
      const sql = `DELETE FROM CCL_users WHERE id = ?`;
      db.query(sql, [id], (err, results) => {
        if (err) {
          console.log("error deleting user");
          res
            .status(500)
            .json({ message: `Error deleting user: ${err.message}` });
          return;
        }
        console.log("user deleted");
        res.status(200).json({ message: "User deleted" });
        return;
      });
    });
  });

// updates only account info, not balance
let updateUser = async (req, res, next) => {
  console.log("started updateUser");
  const { newUsername, newEmail, newPassword, oldPassword, id } = req.body;

  if (!newUsername || !newEmail || !newPassword || !oldPassword) {
    console.log("missing  in input");
    res.status(400).json({ message: "Please fill out all fields" });
    return;
  }

  if (!id) {
    console.log("id not provided");
    res.status(401).json({
      message:
        "You are not logged in or JWT is not valid. Try signing out and in again.",
    });
    return;
  }

  const query = "SELECT * FROM CCL_users WHERE id = ?";
  db.query(query, [id], async (err, results) => {
    if (err) {
      console.log("error fetching user");
      res.status(500).json({ message: `Error fetching user: ${err.message}` });
      return;
    }

    if (results.length === 0) {
      console.log("user does not exist");
      res.status(400).json({ message: "User does not exist" });
      return;
    }

    const user = results[0];
    console.log("user: " + JSON.stringify(user));
    console.log("results: " + JSON.stringify(results));

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      console.log("old password is incorrect");
      res.status(400).json({ message: "Old password is incorrect" });
      return;
    }

    console.log("old password is correct");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql =
      "UPDATE CCL_users SET username = ?, email = ?, password = ? WHERE id = ?";
    const params = [newUsername, newEmail, hashedPassword, parseInt(id)];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.log("in db.query: error updating user");
        res
          .status(500)
          .json({ message: `Error updating user: ${err.message}` });
        return;
      }
      console.log(
        `User with id ${id} updated successfully. New username: ${newUsername}, new email: ${newEmail}`
      );
      const token = jwt.sign(
        { id: id, username: newUsername },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: 86400, // expires in 24 hours
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        // sameSite: 'none',
        // include 'secure: true' as well if using https
      });
      console.log("new token: " + token);
      res.status(200).json({ message: "User updated successfully" });
    });
  });
};

let depositBalance = (req, res, next) => {
  console.log("req.body.amount: " + req.body.amount);
  db.query(
    `UPDATE CCL_users SET balance = balance + ${req.body.amount} WHERE id = ${req.params.id}`,
    function (err, result, fields) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(
        "Added " +
          req.body.amount +
          " to balance of user with id " +
          req.params.id
      );
      res.status(200).json({
        message: "Balance successfully deposited.",
      });
      next();
    }
  );
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  depositBalance,
};
