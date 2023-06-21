const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/database").config;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

function registerUser(req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // Input validation
  if (!username || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  // Check for existing user
  const query = "SELECT * FROM CCL_users WHERE username = ? OR email = ?";
  db.query(query, [username, email], (error, results) => {
    if (error) {
      res
        .status(500)
        .json({ message: "Error occurred while checking for existing user" });
      return;
    }

    if (results.length > 0) {
      res.status(400).json({ message: "Username or email already exists" });
      return;
    }

    // Hash password and add user to database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        res
          .status(500)
          .json({ message: "Error occurred while hashing password" });
        return;
      }

      const insertQuery =
        "INSERT INTO CCL_users (username, email, password) VALUES (?, ?, ?)";
      db.query(
        insertQuery,
        [username, email, hashedPassword],
        (err, result) => {
          if (err) {
            res.status(500).json({
              message: "Error occurred while inserting user to the database",
            });
            return;
          }

          // Create JWT and send it back to the client
          const token = jwt.sign(
            { id: result.id, username: username },
            ACCESS_TOKEN_SECRET,
            {
              expiresIn: 86400, // expires in 24 hours
            }
          );
          res.cookie("token", token, {
            httpOnly: true,
            // include 'secure: true' as well if using https, have to check back if node from the fh is using https
          });
          res.status(201).json({
            message: "User registered successfully",
            result,
            token: token,
            user: {
              id: result.insertId,
              username: username,
              email: email,
              balance: 0,
            },
          });
        }
      );
    });
  });
}

function loginUser(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    console.log('User did not provide username or password')
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const query = "SELECT * FROM CCL_users WHERE username = ?";
  db.query(query, [username], (error, results) => {
    if (error) {
      console.log('Error occurred while checking for user')
      res
        .status(500)
        .json({ message: "Error occurred while checking for user" });
      return;
    }

    if (results.length === 0) {
      console.log('Username does not exist')
      res.status(400).json({ message: "Username does not exist" });
      return;
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        console.log('Error occurred during password comparison')
        res
          .status(500)
          .json({ message: "Error occurred during password comparison" });
        return;
      }

      if (!match) {
        console.log('Incorrect password')
        res.status(400).json({ message: "Incorrect password" });
        return;
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
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

      console.log('User login successful')
      res.status(200).json({
        message: "User login successful",
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          balance: user.balance,
        },
      });
    });
  });
}

function logout(req, res, next) {
  res.clearCookie("token");
  res.status(200).json({ message: "User logout successful" });
}

let sendBackUserDataFromToken = (req, res, next) => {
  if (req.auth) {
    console.log(
      "[sendBackUserDataFromToken]: req.auth: " + JSON.stringify(req.auth)
    );
    const query = "SELECT * FROM CCL_users WHERE id = ?";
    db.query(query, [req.auth.id], (error, results) => {
      if (error) {
        res
          .status(500)
          .json({ message: "Error occurred while checking for user" });
        return;
      }

      if (results.length === 0) {
        res.status(400).json({ message: "User does not exist" });
        return;
      }

      const user = results[0];
      console.log(
        "user found, sending back user data: " +
          JSON.stringify({
            id: user.id,
            username: user.username,
            email: user.email,
            balance: user.balance,
          })
      );
      res.status(200).json({
        message: "User found",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          balance: user.balance,
        },
      });
    });
  } else {
    res.status(400).json({ message: "User is not logged in" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logout,
  sendBackUserDataFromToken,
};
