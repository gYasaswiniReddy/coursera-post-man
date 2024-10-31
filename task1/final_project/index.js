const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

function auth(req,res,next){
    //recuperer le jeton 
    if(req.session.authorization){
        const token = req.session.authorization["accessToken"]
        //verifier la presence du token
        if(!token){
            return res.status(401).send("Token non fourni")
        }
        //s'il existe, on fait la verification
        jwt.verify(token, "secret" ,(err , user)=>{
            if(err){
                return res.status(401).send('Token invalide')
            }
        //si c'est valide
        req.session.user = user;
        next();
        })
    }else{
        return res.status(403).send('Utilisateur non connecté')
    }
};
app.use("/customer/auth/*",auth);

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
module.exports={auth}