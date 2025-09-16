const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=> { //returns boolean
  return users.some(user => user.username === username); 
}

const authenticatedUser = (username,password)=>{ //returns boolean
  if (isValid(username)) {
    return users.filter(user => user.username === username && user.password === password).length > 0;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token in session
    req.session.authorization = {
        accessToken
    }
    return res.status(200).json({message: `${username} logged in.`});
  } else {
    return res.status(200).json({message: `Login failed.`})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.user.data;
  books[isbn].reviews[username] = req.body.review;
  return res.status(200).json({message: books[isbn].title + ' review added.'});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.user.data;
  books[isbn].reviews[username].delete;
  return res.status(200).json({message: books[isbn].title + ' review deleted.'});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
