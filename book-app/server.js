'use strict';

// Import dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// Import local helpers
const Book = require('./models/book.js');

// Setup server
const app = express();
const PORT = process.env.PORT || 3000;

// Set express view engine
app.set('view engine', 'ejs');

// Setup middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

app.get('/', renderHome);
app.get('/searches/new', renderNewSearch);
app.post('/searches', searchBook);

app.get('*', (err, res) => handleError(err, res));

function renderHome(req,res){
    res.render('pages');
}

function renderNewSearch(req, res){
    res.render('pages/searches/new');
};

async function searchBook(req, res){
    let url = 'https://www.googleapis.com/books/v1/volumes?q=';

    if(req.body.search[1] === 'title') {url += `+intitle:${req.body.search[0]}`;}
    if(req.body.search[1] === 'author') {url += `+inauthor:${req.body.search[0]}`;}

    const results = await superagent.get(url);
    const books = results.body.items.map(book => {
        return new Book(book.volumeInfo);
    });
    
    res.render('pages/searches/show', { searchResults: books });
}

function handleError(err, res) {
    res.status(404).send('This route does not exist')
}

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${PORT}`);
})