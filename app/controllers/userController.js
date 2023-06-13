const userModel = require('../models/userModel');

function getUsers(req,res,next){
    userModel.getUsers()
        .then((users) => {
            res.json(users); // this was: res.render('users', {users});
        })
        .catch((err)=>{
            res.status(404);
            next(err);
        })
}

function getUser(req,res,next){
    console.log(parseInt(req.params.id));
    userModel.getUser(parseInt(req.params.id))
        .then((user)=>{
            console.log(typeof(user));
            res.json(user); // this was: res.render('user', {user});
        })
        .catch((err)=>{
            res.status(404);
            next(err);
        })

}

function editUser(req,res,next) {
    userModel.getUser(parseInt(req.params.id))
        .then((user) => {
            res.json(user); // this was: res.render('editUser', {user});
        })
        .catch((err)=>{
            res.status(404);
            next(err);
        })
}

function updateUser(req,res,next) {
    req.body.id = req.params.id;
    userModel.updateUser(req.body)
    .then((user) => {
        res.json(user); // this was: res.render('user', {user});
    })
    .catch((err)=>{
        res.status(404);
        next(err);
    })
}

function addUser(req,res,next) {
    userModel.getUser(1)
        .then((user) => {
            res.json(user); // this was: res.render('addUser', {user});
        })
        .catch((err)=>{
            res.status(404);
            next(err);
        })
}

function register(req,res,next) {
    userModel.getUser(1)
        .then((user) => {
        res.json(user); // this was: res.render('addUser', {user});
    })
    .catch((err)=>{
        res.status(404);
        next(err);
    })
}

function registerNewUser(req,res,next) {
    userModel.addUser(req.body)
        .then((user) => {
            res.json(user); // this was: res.redirect("/users");
        })
        .catch((err)=>{
            res.status(404);
            next(err);
        })
}
function setNewUser(req,res,next) {
    userModel.addUser(req.body)
        .then((user) => {
            res.json(user); // this was: res.redirect("/users/" + user.id);
        })
        .catch((err)=>{
            res.status(404);
            next(err);
        })
}


function deleteUser(req,res,next) {
    userModel.deleteUser(req.params.id)
        .then(() => {
            res.json({}); // this was: res.redirect("/users");
        })
        .catch((err)=>{
            res.status(404);
            next(err);
        })
}


module.exports = {
    getUsers,
    getUser,
    editUser,
    updateUser,
    addUser,
    setNewUser,
    deleteUser,
    register,
    registerNewUser,

}