const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
           users[username] = {password: password}
            return res.status(200).json({message: "Customer successfully registred. Now you can login"});
        } else {
            return res.status(400).json({message: "Customer already exists!"});
        }
    }
    return res.status(404).json({message: "Username and/or password are not provided"});
});

// Get the book list available in the shop
/*
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books, null,4))
});
*/
public_users.get('/', async function (req, res) {
    try {
        const data = await new Promise((resolve) => {
            resolve(books);
        });
        res.send(JSON.stringify(data, null, 4));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get book details based on ISBN
/*
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn
    res.send(books[isbn]);
});
*/
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn
    new Promise((resolve) => {
        resolve(books[isbn]);
    })
    .then((data) => {
        res.send(books[isbn]);
    })
    .catch((error) => {
        res.status(500).json({message: error.message});
    });
});
  
// Get book details based on author
/*
public_users.get('/author/:author',function (req, res) {
    let author=req.params.author
    let reqBooks = []
    const reqKeys = Object.keys(books).filter(key => books[key].author == author)
    for (let reqKey of reqKeys) {
        let book = {
            "isbn": reqKey,
            "title": books[reqKey].title,
            "reviews": books[reqKey].reviews,
        } 
        reqBooks.push(book);
    }
    return res.status(200).json({"booksbyauthor": reqBooks});
});
*/
public_users.get('/author/:author',function (req, res) {
    let author=req.params.author
    new Promise((resolve) => {
        let reqBooks = []
        const reqKeys = Object.keys(books).filter(key => books[key].author == author)
        for (let reqKey of reqKeys) {
            let book = {
                "isbn": reqKey,
                "title": books[reqKey].title,
                "reviews": books[reqKey].reviews,
            } 
            reqBooks.push(book);
        }
        resolve(reqBooks);
    })
    .then((data) => {
        res.status(200).json({"booksbyauthor": data});
    })
    .catch((error) => {
        res.status(500).json({message: error.message});
    });
});

// Get all books based on title
/*
public_users.get('/title/:title',function (req, res) {
    let title=req.params.title
    let reqBooks = []
    const reqKeys = Object.keys(books).filter(key => books[key].title == title)
    for (let reqKey of reqKeys) {
        let book = {
            "isbn": reqKey,
            "author": books[reqKey].author,
            "reviews": books[reqKey].reviews,
        } 
        reqBooks.push(book);
    }
    return res.status(200).json({"booksbytitle": reqBooks});
});
*/
public_users.get('/title/:title',async function (req, res) {
    try {
        let title=req.params.title
        const data = await new Promise((resolve) => {
            let reqBooks = [];
            const reqKeys = Object.keys(books).filter(key => books[key].title == title);
            for (let reqKey of reqKeys) {
                let book = {
                    "isbn": reqKey,
                    "author": books[reqKey].author,
                    "reviews": books[reqKey].reviews,
                } 
                reqBooks.push(book);
            }
            resolve(reqBooks);
        });
        res.status(200).json({"booksbytitle": data});
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
