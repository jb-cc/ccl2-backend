// require database connection, bcrypt and jsonwebtoken, secret key



const db = require("../config/database").config;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;




// in most other functions, we use the req.body.id to get the id of the user, but in this case, we use req.auth.id
// This is because we are using the JWT middleware, which puts the payload of the JWT into the req.auth variable
// This is for security reasons, because the JWT is signed with the secret key; and because this route is protected by the JWT middleware, we can be sure that the user is logged in, and that the JWT is valid



let deleteUser = (req, res, next) =>
  new Promise((resolve, reject) => {
    console.log("req.auth.id: " + req.auth.id);
    req.body.id = req.auth.id;
    const id = req.body.id;
    const password = req.body.password;

// query the database for the user with the specified id
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

      // check for password match
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("password is incorrect");
        res.status(400).json({ message: "Password is incorrect" });
        return;
      }
      console.log("password is correct");

      // if password is correct, delete the user
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
  req.body.id = req.auth.id;
  const { newUsername, newEmail, newPassword, oldPassword, id } = req.body;

  // check for missing input
  if (!newUsername || !newEmail || !newPassword || !oldPassword) {
    console.log("missing input");
    res.status(400).json({ message: "Please fill out all fields" });
    return;
  }

  // check for missing id. This should never happen, because the id is set to req.auth.id, which is set by the JWT middleware
  if (!id) {
    console.log("id not provided");
    res.status(401).json({
      message: "You are not logged in or JWT is not valid. Try signing out and in again.",
    });
    return;
  }

  // Check for existing username or email
  const userCheckQuery = "SELECT * FROM CCL_users WHERE username = ? OR email = ?";
  db.query(userCheckQuery, [newUsername, newEmail], (error, results) => {
    if (error) {
      console.log("Error occurred while checking for existing user");
      console.log(error);
      res.status(500).json({
        message:
            "Error occurred while checking for existing user. If you are trying to input an emoji, please remove it, as usernames can not contain emojis.",
      });
      return;
    }

    // if username / email exists, return error
    if (results.length > 0) {
      res.status(400).json({ message: "Username or email already exists" });
      return;
    }

    // Fetch user
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

      // check for password match
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        console.log("old password is incorrect");
        res.status(400).json({ message: "Old password is incorrect" });
        return;
      }

      // if password is correct, update the user
      console.log("old password is correct");
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const sql = "UPDATE CCL_users SET username = ?, email = ?, password = ? WHERE id = ?";
      const params = [newUsername, newEmail, hashedPassword, parseInt(id)];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("in db.query: error updating user");
          res.status(500).json({ message: `Error updating user: ${err.message}` });
          return;
        }
        console.log(`User with id ${id} updated successfully. New username: ${newUsername}, new email: ${newEmail}`);

        // create new token with updated username
        const token = jwt.sign({ id: id, username: newUsername }, ACCESS_TOKEN_SECRET, { expiresIn: 86400 });

        // set new token as cookie
        res.cookie("token", token, { httpOnly: true });
        console.log("new token: " + token);
        res.status(200).json({ message: "User updated successfully" });
      });
    });
  });
};


// updates account balance, this does not require much security, as anyone can deposit infinite money into their account (its not real money)
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
  updateUser,
  deleteUser,
  depositBalance,
};
