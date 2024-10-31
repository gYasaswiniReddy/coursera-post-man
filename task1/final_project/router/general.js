const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Activer express.json() pour le parsing des JSON


// Route pour l'inscription
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Vérification que les champs username et password sont fournis
  if (!username || !password) {
    return res.status(400).send("Veuillez fournir un nom d'utilisateur et un mot de passe.");
  }

  // Vérification si le nom d'utilisateur existe déjà
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).send("Le nom d'utilisateur existe déjà dans la base.");
  }

  // Enregistrement du nouvel utilisateur
  users.push({ username, password });
  res.status(201).send(`${username} est inscrit avec succès.`);
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let myPromisebooks = new Promise((resolve, reject)=>{
    if(books){
      resolve(books);
    }
    else{
      reject("aucun livre disponible")
    }
  });
  myPromisebooks
  .then((books)=>{
    res.status(200).send(JSON.stringify(books))
  })
  .catch((error)=>{
    res.status(500).send(error)
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;
  const book =books[isbn]
  let myPromisebooks= new Promise((resolve,reject)=>{

    if(!book){
      reject("livre nom trouvé")
    }else{
      resolve(book)
    }
  })
  myPromisebooks
  .then((book)=>{
    res.status(200).send(book)
  })
  .catch((error)=>{
    res.status(500).send(error)
  })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author= req.params.author;
  const book = Object.values(books).find(book=>book.author === author)
  let myPromisebooks= new Promise((resolve,reject)=>{

    if(!book){
      reject("livre nom trouvé")
    }else{
      resolve(book)
    }
  })
  myPromisebooks
  .then((book)=>{
    res.status(200).send(book)
  })
  .catch((error)=>{
    res.status(500).send(error)
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const book =Object.values(books).find(book=>book.title === title)
  let myPromisebooks= new Promise((resolve,reject)=>{

    if(!book){
      reject("livre nom trouvé")
    }else{
      resolve(book)
    }
  })
  myPromisebooks
  .then((book)=>{
    res.status(200).send(book)
  })
  .catch((error)=>{
    res.status(500).send(error)
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn]
  if(!book){
    return res.send('Livre non trouver')
  }else{
    res.json(book.reviews);
  }
});

module.exports.general = public_users;
