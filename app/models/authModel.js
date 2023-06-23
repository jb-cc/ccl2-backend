// This is the model with the database queries for the authentication routes.
// In case of an error, the process is stopped and the error is sent to the client, where it gets displayed.





// require the database connection, jwt and bcrypt for authentication, and dotenv for the environment variables

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/database").config;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;




// registerUser function:
// Handles user registration by inserting new users into the database.

function registerUser(req, res, next) {
  // Extract username, email, and password from request body

  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // Validate that all required fields are present
  if (!username || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  // Query to check if a user with the given username or email already exists
  const query = "SELECT * FROM CCL_users WHERE username = ? OR email = ?";
  db.query(query, [username, email], (error, results) => {
    if (error) {
      console.log("Error occurred while checking for existing user");
      console.log(error);
      res.status(500).json({
        message:
          "Error occurred while checking for existing user.If you are trying to input an emoji, please remove it, as usernames can not contain emojis.",
      });
      return;
    }
    // If a user with the given username or email already exists, respond with an error

    if (results.length > 0) {
      res.status(400).json({ message: "Username or email already exists" });
      return;
    }

    // Hash the password and insert the new user into the database
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

          // Create a JWT token for the new user and send it back to the client
          db.query("SELECT LAST_INSERT_ID() AS id", (err, id) => {
            if (err) {
              res.status(500).json({
                message: "Error occurred while fetching last inserted id",
              });
              return;
            }
            const newID = id[0].id;
            console.log(
              "User registered successfully with id: " +
                newID+
                " username: " +
                username +
                " email: " +
                email
            );
            const token = jwt.sign(
              { id: newID, username},
              ACCESS_TOKEN_SECRET,
              {
                expiresIn: 86400, // expires in 24 hours
              }
            );
            res.cookie("token", token, {
              httpOnly: true,
              maxAge: 86400,
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
          });
        }
      );
    });
  });
}


// loginUser function:
// Handles user login by verifying credentials and creating a JWT, which then gets sent back to the client.


function loginUser(req, res, next) {

  // extract username and password from request body
  const username = req.body.username;
  const password = req.body.password;


  // Validate that username and password are provided

  if (!username || !password) {
    console.log("User did not provide username or password");
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  // Query to get the user with the provided username

  const query = "SELECT * FROM CCL_users WHERE username = ?";
  db.query(query, [username], (error, results) => {
    if (error) {
      console.log("Error occurred while checking for user" + error);
      res.status(500).json({
        message:
          "Error occurred while checking user.If you are trying to input an emoji, please remove it, as usernames can not contain emojis.",
      });
      return;
    }

    // If no user is found, respond with an error

    if (results.length === 0) {
      console.log("Username does not exist");
      res.status(400).json({ message: "Incorrect username or password" });
      return;
    }

    const user = results[0];

    // Compare provided password with the hashed password in the database

    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        console.log("Error occurred during password comparison");
        res
          .status(500)
          .json({ message: "Error occurred during password comparison" });
        return;
      }

      // If passwords don't match, respond with an error

      if (!match) {
        console.log("Incorrect password");
        res.status(400).json({ message: "Incorrect username or password" });
        return;
      }

      // If password is correct, create a token and send it back to the client

      const token = jwt.sign(
        { id: user.id, username: user.username },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: 86400, // expires in 24 hours
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 86400,
        // sameSite: 'none',
        // include 'secure: true' as well if using https
      });

      console.log("User login successful");
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


// logout function:
// Handles user logout by clearing the cookie containing the JWT.

function logout(req, res, next) {
  res.clearCookie("token");
  res.status(200).json({ message: "User logout successful" });
}


// sendBackUserDataFromToken function:
// Retrieves and sends back user data based on the authenticated JWT. This is important for the client to have access to the user data after a page refresh.
// Also, this is required for the client to know if the user is authenticated or not. For example, the navbar component needs to know if the user is authenticated or not to display the correct links.


let sendBackUserDataFromToken = (req, res, next) => {

  // If the request is authenticated (the JWT is valid), the express-jwt middleware saves the payload of the JWT in the req.auth object.
  // Therefore, we can use that to retrieve the user id and send back the user data.

  if (req.auth) {
    console.log(
      "[sendBackUserDataFromToken]: req.auth: " + JSON.stringify(req.auth)
    );

    // if the user is authenticated, retrieve the user data from the database

    const query = "SELECT * FROM CCL_users WHERE id = ?";
    db.query(query, [req.auth.id], (error, results) => {
      if (error) {
        res
          .status(500)
          .json({ message: "Error occurred while checking for user" });
        return;
      }

      // If no user is found, respond with an error

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

      // send back the user data. This contains the user id, username, email and balance.
      // In the frontend, The pinia store will then save this data in the UserStore.users, which is then used to display the user data in the navbar component and the inventory for example.
      // Also, in the pinia store, the UserStore.isLoggedIn is set to true, which is then used to display the correct links in the navbar component.

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
