const { User } = require('../models/user');

let data={
}

let currentUser;

function getUsers(){
    return User.find({ }).select("username acno balance")
    .then(users=>{
        if(users){
            return {
                statusCode:200,
                users:users
            }
        }
    })
}

function addUser(username, password, acno){
    return User.findOne({
        username
    })
    .then(user=>{
        if(user){
            return {
                statusCode:400,
                message:"Account already exists. Please login"
            }
        }
        const newUser = new User({
            username, password, acno, history:[], balance:0
        })
        newUser.save();
        
        return {
            statusCode:200,
            message:"Account created successfully"
        }
    })
    // data[username]={username, password, acno, history:[], balance:0};
}
function login(username, password){
    return User.findOne({
        username,
        password
    })
    .then(user=>{
        if(user){
            return {
                statusCode:200,
                message:"Logged In successfully"
            }
        }
        return {
            statusCode:400,
            message:"Invalid details"
        }
    });
}


function deposit(username, amount){
    return User.findOne({
        username
    })
    .then(user=>{
        if(user){
            user.balance+=amount
            let bal=user.balance;
            // btag.textContent="available balance:"+bal
            user.history.push({
                typeOfTransaction:"Credit",
                amount:amount
            });
            user.save();
            return { statusCode:200, balance:bal, message: "Deposit successful"};
        }
        return {
            statusCode:400,
            message:"Invalid details"
        }
    });
}
function history(username){
    return User.findOne({
        username
    })
    .then(user=>{
        return { statusCode:200, history: user.history};
    })
}

function withdraw(username, amount){
    return User.findOne({
        username
    })
    .then(user=>{
        if(user){
            if(amount>user.balance){
                return { statusCode:400, message: "Insufficient balance"};
            }
            user.balance-=amount
            let bal=user.balance;
            // btag.textContent="available balance:"+bal
            user.history.push({
                typeOfTransaction:"Debit",
                amount:amount
            });
            user.save();
            return { statusCode:200, balance:bal, message: "Withdraw successful"};
        }
        return {
            statusCode:400,
            message:"Invalid details"
        }
    });
}


function deleteUser(username){
    return User.deleteOne({
        username
    })
    .then(user=>{
        return { statusCode:200, message: "User deleted successfully"};
    })
}
function setCurrentUser(username){
    currentUser= username;
}
function getCurrentUser(){
    return currentUser;
}
module.exports = {
    getUsers:getUsers,
    addUser:addUser,
    login:login,
    deposit,
    withdraw,
    history,
    deleteUser
    // setCurrentUser:setCurrentUser,
    // getCurrentUser:getCurrentUser
}