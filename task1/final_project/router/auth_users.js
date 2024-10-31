const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];
let reviews = {};

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const validUserName= users.filter((user) =>{
  return user.username===username
});
  return validUserName.length>0;
};

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const validuser = users.filter((user)=>{
  return user.username === username && user.password === password;
});
return validuser.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const{username,password} = req.body;
  if(!username || !password){
    return res.status(400).json("le nom et le mot de passe de l'utilisateur sont requis")
  }
  if(authenticatedUser(username,password)){
    const accessToken= jwt.sign({username:username}, "secret",{expiresIn:'1h'});

    //enregistrer le token
    req.session.authorization ={accessToken};
    return res.status(200).json({ message: "Connexion réussie", accessToken: accessToken });

  } else {
  
    return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
}

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  
  const {review} = req.body //on recupere le review
  const isbn = req.params.isbn //on recupere le isbn dans les parametres
  const username = req.session.user ? req.session.user.username : null;// on recupere le user dans la session

  //verifier s'il est authantifier

  if(!username){
    return res.status(400).json("l'utilisateur n'est pas connecté");
  }

  // on verifie l'isbn et le review

  if(!isbn || !review){
    return res.status(400).send("isbn et review sont requis")
  }

  //initialiseer un objet review
  if(!reviews[isbn]){
    reviews[isbn]=[]
  }
  const existeReview= reviews[isbn].findIndex(r=>r.username ===username)
  if(existeReview !==-1){
    reviews[isbn][existeReview].review= review;
    return res.status(200).send("review modifer avec succes")
  }else{
    reviews[isbn].push({username,review});
    return res.status(200).send("review ajouté avec succes")
  }
});

//supprimer les review

regd_users.delete("/auth/review/:isbn",(req,res) =>{

  const isbn = req.params.isbn;
  const username = req.session.user ? req.session.user.username : null;

  if(!username){
    return res.status(400).send("l'utilisateur n'est pas connecté ")
  }
  if(!isbn||!reviews[isbn]){
    return res.status(400).send("isbn et review requis")
  }
  const existeReview= reviews[isbn].findIndex(r=>r.username ===username)
  if(existeReview !==-1){
    reviews[isbn].splice(username,1);
    return res.status(200).send("review supprimé avec succes")
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
