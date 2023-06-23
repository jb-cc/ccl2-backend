// require database connection, bcrypt and jsonwebtoken for authentication, and the secret key for the jsonwebtoken


const db = require("../config/database").config;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;



// delete user function:
// used in the edit user view, when the user decides to delete their account.
// The user must enter their password to confirm the deletion.


let deleteUser = (req, res, next) =>
    new Promise((resolve, reject) => {

        // The express-jwt middleware saves the payload of the JWT in req.auth.
        // In other functions, I just use the userID from the userStore (client-side Store made with pinia), but here I am using the ID from the JWT payload.
        // here however, I am using the user id from the payload to delete the user from the database, as the JWT has already been verified.
        // this is a security measure, as the user must be logged in to delete their account.
        const id = req.auth.id;
        const password = req.body.password;

        const sql = `SELECT * FROM CCL_users WHERE id = ?`;

        db.query(sql, [id], async (err, results) => {
            if (err) {
                console.log(`Error fetching user: ${err.message}`);
                res
                    .status(500)
                    .json({message: 'Error fetching user, are you logged in?'});
                return;
            }

            const user = results[0];
            console.log("user: " + JSON.stringify(user));

            // check if the password is correct
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log(`User with id ${id} tried to delete their account, but password is incorrect`);
                res.status(400).json({message: "Password is incorrect"});
                return;
            }
            console.log("password is correct");

            // query to delete the user
            const sql = `DELETE FROM CCL_users WHERE id = ?`;
            db.query(sql, [id], (err, results) => {
                if (err) {
                    console.log("error deleting user");
                    res
                        .status(500)
                        .json({message: `Error deleting user: ${err.message}`});
                    return;
                }
                console.log("user deleted");
                res.status(200).json({message: "User deleted"});
                return;
            });
        });
    });



// update user function:
// updates only account info, not balance
let updateUser = async (req, res, next) => {
    console.log("started updateUser");
    const {newUsername, newEmail, newPassword, oldPassword, id} = req.body;

    // checks if any of the fields are empty
    if (!newUsername || !newEmail || !newPassword || !oldPassword) {
        console.log("missing  in input");
        res.status(400).json({message: "Please fill out all fields"});
        return;
    }

    // checks for id
    if (!id) {
        console.log("id not provided");
        res.status(401).json({
            message:
                "You are not logged in or JWT is not valid. Try signing out and in again.",
        });
        return;
    }

    // gets the user from the database
    const query = "SELECT * FROM CCL_users WHERE id = ?";
    db.query(query, [id], async (err, results) => {
        if (err) {
            console.log("error fetching user");
            res.status(500).json({message: `Error fetching user: ${err.message}`});
            return;
        }

        if (results.length === 0) {
            console.log("user does not exist");
            res.status(400).json({message: "User does not exist"});
            return;
        }

        const user = results[0];
        console.log("user: " + JSON.stringify(user));
        console.log("results: " + JSON.stringify(results));

        // checks if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            console.log("old password is incorrect");
            res.status(400).json({message: "Old password is incorrect"});
            return;
        }

        // if the old password is correct, hash the new password and update the user
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
                    .json({message: `Error updating user: ${err.message}`});
                return;
            }
            console.log(
                `User with id ${id} updated successfully. New username: ${newUsername}, new email: ${newEmail}`
            );

            // create a new token with the new username
            const token = jwt.sign(
                {id: id, username: newUsername},
                ACCESS_TOKEN_SECRET,
                {
                    expiresIn: 86400, // expires in 24 hours
                }
            );

            // set the new token as a cookie
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 86400,
                // sameSite: 'none',
                // include 'secure: true' as well if using https
            });
            console.log("new token: " + token);
            res.status(200).json({message: "User updated successfully"});
        });
    });
};


// deposit balance function:
// adds balance to the users account, does not update any other info. Gets used from the user profile page --> deposit balance
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
