const db = require('../config/database').config;
const bcrypt = require('bcrypt');



let getUsers = () => new Promise((resolve,reject)=>{
    db.query("SELECT * FROM CCL_users", function (err, users, fields) {
        if (err) {
            reject(err)
        }
        console.log('got users: '+users);
        resolve(users);
    });
});

let getUser = (id) => new Promise((resolve,reject)=>{
    console.log('id: '+id);
    db.query(`SELECT * FROM CCL_users WHERE id=${id}`, function (err, users, fields){
        if(err){
            reject(err);
        }
        console.log(`user with id ${id}: `+JSON.stringify(users[0]));
        resolve(users[0]);
    });
});

let deleteUser = (id) => new Promise((resolve,reject)=>{
    db.query(`DELETE FROM CCL_users WHERE id=${id}`, function (err, users, fields) {
        if (err) {
            reject(err);
        }
        console.log(users);
        resolve(users[0]);
    });
});

// updates only account info, not balance
let updateUser = (userData) => new Promise( async (resolve,reject)=> {
    userData.password = await bcrypt.hash(userData.password, 10);
    let sql = "UPDATE CCL_users SET " +
        "username = " + db.escape(userData.username) +
        ", email = " + db.escape(userData.email) +
        ", password = " + db.escape(userData.password) +
        "WHERE id = " + parseInt(userData.id);
    console.log(sql);
    db.query(sql, function (err, result, fields){
        if(err) {
            reject(err)
        }
        resolve(userData)
    });
});

let addUser = (userData) => new Promise( async (resolve,reject)=> {
    console.log(userData.username, userData.email, userData.password);
    userData.password = await bcrypt.hash(userData.password, 10);
    let sql = "INSERT INTO CCL_users (username, email, password) VALUES (" +
        db.escape(userData.username) + ",  " +
        db.escape(userData.email)+ ",  "  +
        db.escape(userData.password)+ ")" ;

    console.log('sql command sent: '+sql);
    db.query(sql, function (err, result, fields){
        if(err) {
            console.log(err)
            reject(err)
            return
        }
        userData.id = result.insertId;
        console.log('result.insertId: '+result.insertId);
        resolve(userData)
    });
});


let depositBalance= (req, res, next) => {
    console.log('req.body.amount: '+req.body.amount);
    db.query(`UPDATE CCL_users SET balance = balance + ${req.body.amount} WHERE id = ${req.params.id}`, function (err, result, fields) {
        if (err) {
            console.log(err);
            return
        }
        console.log('Added '+req.body.amount+' to balance of user with id '+req.params.id);
        res.status(200).json({
            message: "Balance successfully deposited.",
        });
        next();

    });
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    addUser,
    deleteUser,
    depositBalance,
}