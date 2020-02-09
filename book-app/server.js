'use strict';

// Import dependencies
require('dotenv').config();
const express = require('express');
const pg = require('pg');
// const cors = require('cors');
const superagent = require('superagent');

// Import local helpers
const Book = require('./models/book.js');

// Setup server
const app = express();
const PORT = process.env.PORT || 3000;

// Setup database
const client = new pg.Client(process.env.DATABASE_URL);
client.connect(err => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected to DB')
    }
  });
client.on('error', err => console.error(err));

// Set express view engine
app.set('view engine', 'ejs');

// Setup middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// app.use(cors());

app.get('/', renderHome);
app.get('/searches/new', renderNewSearch);
app.get('/books/:id', getSingleBook);
app.post('/books', addBook);
app.post('/searches', searchBook);

app.get('*', (err, res) => handleError(err, res));

function renderHome(req,res){
    const SQL = `SELECT * FROM books;`;

    return client.query(SQL)
        .then(result => {
            res.render('pages', { books: result.rows } );
        })
        .catch(console.error);
}

function renderNewSearch(req, res){
    res.render('pages/searches/new');
};

function getSingleBook(request, response){
    let SQL = 'SELECT * FROM books WHERE id=$1;';
    let values = [request.params.id];
  
    client.query(SQL, values)
      .then(result => {
        response.render('pages/books/show', { books : result.rows});
      })
      .catch(console.error);
}

function addBook(request, response){
    let {title, author, ISBN, image_url, description, bookshelf} = request.body;

    //Add book to database
    let SQL = 'INSERT INTO books(title, author, ISBN, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;';
    let values = [title, author, ISBN, image_url, description.slice(0,255), bookshelf];

    client.query(SQL, values)
        .then(result=> response.redirect(`/books/${result.rows[0].id}`))
        .catch(err => console.error(err));

}

async function searchBook(req, res){
    let url = 'https://www.googleapis.com/books/v1/volumes?q=';

    if(req.body.search[1] === 'title') {url += `+intitle:${req.body.search[0]}`;}
    if(req.body.search[1] === 'author') {url += `+inauthor:${req.body.search[0]}`;}

    const results = await superagent.get(url);
    // console.log(results.body.items);
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