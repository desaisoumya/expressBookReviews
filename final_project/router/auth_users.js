const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users[username];
}

const authenticatedUser = (username,password)=>{ //returns boolean
    if (isValid(username) && users[username].password === password) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username, password)) {
        let token = jwt.sign({
            username: username
        }, "access", {expiresIn: 60*60});
        req.session.authorization = {accessToken: token};
        req.session.username=username;
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let reqBook = books[isbn]
    if (reqBook) {
        let review = req.query.review;
        let username = req.session.username;
        if (review) {
            reqBook.reviews[username] = review;
        }
        books[isbn] = reqBook
        res.send("The review for the book with ISBN " + isbn + " has been added/updated")
    } else {
        res.send("Unable to find book!");
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let reqBook = books[isbn]
    if (reqBook) {
        let username = req.session.username;
        delete reqBook.reviews[username];
        books[isbn] = reqBook;
        res.send("Review for the ISBN " + isbn + " posted by the user " + username + " deleted")
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
