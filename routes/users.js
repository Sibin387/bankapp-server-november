var express = require('express');
var router = express.Router();
var Bank = require('../services/bank');


function authMiddleware(req,res,next){
  if(req.session.currentUser){
    next();
  }else{
    // next({message:"Please login", status:401});
    res.status(401).send({message:"Please login"})
  }
}

/* GET users listing. */
router.get('/', function(req, res) {
  Bank.getUsers()
  .then(data=>{
    res.status(data.statusCode).send({message: data.message, users:data.users});
  });
});

router.post('/register', function(req,res){
  let usname=req.body.username;
  let pwd=req.body.password;
  let acno=req.body.acno;
  let confirmPassword=req.body.confirmPassword;
  // let data=Bank.getUsers();
  // if(usname in data){//abc in data
  //   res.status(400).send({message: "user already exists. Please login"});
  // }else 
  if(pwd != confirmPassword){
    res.status(400).send({message: "Password and confirm password doesn't match"});
  }
  else{
      Bank.addUser(usname,pwd,acno)
      .then(data=>{
        res.status(data.statusCode).send({message: data.message});
      });
  }
})

router.post('/login', function(req,res){
  let usname=req.body.username;
  let pwd=req.body.password;
  Bank.login(usname, pwd)
  .then(data=>{
    if(data.statusCode==200){
      req.session.currentUser = usname;
    }
    res.status(data.statusCode).send({message: data.message});
  })
  // let data=Bank.getUsers();
  // if(usname in data){//abc in data
  //     let password=data[usname]["password"];
  //     if(pwd==password){
  //         req.session.currentUser = usname;
  //         res.send({message: "Logged in successfully"});
  //     }
  //     else{
  //       res.status(400).send({message: "u provided invalid message!"});
  //     }
  // }
  // else{
  //   res.status(400).send({message: "inavlid user"})
  // }
})

router.post('/deposit', authMiddleware, function(req,res){
  let uname=req.body.username;
  let amt=Number(req.body.amount);

  if(uname!=req.session.currentUser){
    return res.status(400).send({ message: "Invalid user"});
  }

  Bank.deposit(uname, amt)
  .then(data=>{
    res.status(data.statusCode).send({message: data.message, balance: data.balance});
  })
  // let data=Bank.getUsers();
  // if(uname in data){
  //   data[uname]["balance"]+=amt
  //   let bal=data[uname]["balance"]
  //   // btag.textContent="available balance:"+bal
  //   data[uname]["history"].push({
  //     typeOfTransaction:"Credit",
  //     amount:amt
  //   });
  //   res.send({balance:bal, message: "Deposit successful"})
  // }
  // else{
  //   res.status(400).send({message: "inavlid user"})
  // }
})

router.post('/withdraw', authMiddleware, function(req,res){
  let uname=req.body.username;
  let amt=Number(req.body.amount);

  if(uname!=req.session.currentUser){
    return res.status(400).send({ message: "Invalid user"});
  }


  Bank.withdraw(uname, amt)
  .then(data=>{
    res.status(data.statusCode).send({message: data.message, balance: data.balance});
  })
  // let data=Bank.getUsers();
  // if(uname in data){
  //   if(amt>data[uname]["balance"]){
  //     return res.status(400).send({ message: "Insufficient balance"});
  //   }
  //   data[uname]["balance"]-=amt
  //   let bal=data[uname]["balance"]
  //   // btag.textContent="available balance:"+bal
  //   data[uname]["history"].push({
  //     typeOfTransaction:"Debit",
  //     amount:amt
  //   });
  //   res.send({balance:bal, message: "Withdraw successful"})
  // }
  // else{
  //   res.status(400).send({message: "inavlid user"});
  // }
})

router.get('/transaction-history', authMiddleware, function(req, res) {
  let uname = req.session.currentUser;

  Bank.history(uname)
  .then(data=>{
    res.status(data.statusCode).send({history: data.history});
  })
  
  // let data=Bank.getUsers();
  // if(uname in data){
  //   return res.send({history:data[uname].history});
  // }
  // else{
  //   res.status(400).send({message: "inavlid user"});
  // }
});
router.delete('/:id',authMiddleware,  function(req,res){
  Bank.deleteUser(req.params.id)
  .then(data=>{
    res.status(data.statusCode).send({message: data.message});
  })
})

router.get('/test/:id', function(req, res) {
  res.send(req.query.id);
});

module.exports = router;
