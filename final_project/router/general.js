const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (isValid(username)) {
    //user already exists
    console.log('user exists');
    return res.status(200).json({message: "User already exists."});
  }
  if (!username || !password) {
    //username and/or password not provided in request body
    return res.status(200).json({message: "Provide username and password in order to register."});
  }
  users.push({username, password});
  return res.status(200).json({message: `User ${username} created successfully.`});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  let booksPromise = new Promise((resolve, reject) => {
    let result = require("./booksdb.js");
    if (result) {
      resolve(result);
    } else {
      reject("Error retrieving books");
    }
  });
  booksPromise.then((result)=>{
    return res.status(200).json(result);
  }).catch((error) => {
    return res.status(500).json({message: error});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let booksPromise = new Promise((resolve, reject) => {
    let result = require("./booksdb.js");
    result = result[isbn];
    if (result) {
      resolve(result);
    } else {
      reject("Error retrieving book with ISBN " + isbn);
    }
  });
  booksPromise.then((result) => {
    return(res.status(200).json(result));
  }).catch((error) => {
    return res.status(500).json({message: error});
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let searchField = req.params.author;
  let result = [];
  let booksPromise = new Promise((resolve, reject) => {
    let allBooks = require("./booksdb.js");
    Object.keys(allBooks).forEach(key => {
      if (allBooks[key].author === searchField) {
        result.push(books[key]);
      }
    });
    if (result.length > 0) {
      resolve(result);
    } else {
      reject("Error retrieving book(s) by author " + searchField);
    }
  });
  booksPromise.then((result) => {
    return res.status(200).json(result);
  }).catch((error) => {
    return res.status(500).json({message: error});
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let searchField = req.params.title;
  let result = [];
  let booksPromise = new Promise((resolve, reject) => {
    let allBooks = require("./booksdb.js");
    Object.keys(allBooks).forEach(key => {
      if (allBooks[key].title === searchField) {
        result.push(books[key]);
      }
    });
    if (result.length > 0) {
      resolve(result);
    } else {
      reject("Error retrieving book(s) by title " + searchField);
    }
  });
  booksPromise.then((result) => {
    return res.status(200).json(result);
  }).catch((error) => {
    return res.status(500).json({message: error});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
