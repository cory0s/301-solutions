'use strict';

// Import dependencies
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');

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
app.use(methodOverride('_method'));

app.get('/', renderHome);
app.get('/searches/new', renderNewSearch);
app.get('/books/:id', getSingleBook);
app.post('/books', addBook);
app.post('/searches', searchBook);
app.put('/books/:id', updateBook);
app.delete('/books/:id', deleteBook);

app.get('*', (err, res) => handleError(err, res));

function renderHome(req,res){
    const SQL = `SELECT * FROM books;`;
    const bookshelvesSQL = 'SELECT DISTINCT bookshelf FROM books;'
    const join = 'SELECT books.title, people.name, books.id FROM books JOIN people ON books.id = people.book_id;'
    const people = 'SELECT * FROM people;';

    // const bookshelves = await getBookshelves();
    let allBooks;
    let allBookshelves;
    // console.log('BOOKSHELVES', bookshelves);
    // client.query(join)
    //     .then(result => console.log(result));

    client.query(people).then(result => {
        console.log('PEOPLE', result.rows)
    });

    client.query(SQL)
        .then(result => {
            // console.log(result);
            allBooks = result;
            // console.log(allBooks);
            // res.render('pages', { books: result.rows } );
        })
        .then(() => {
            client.query(bookshelvesSQL)
            .then(result => {
                allBookshelves = result;
                res.render('pages', {books: allBooks.rows, bookshelves: allBookshelves.rows })
            })
        })
        .catch(err => console.error(err));

}

function updateBook(req, res){
    const id = req.params.id;
    const {title, author, ISBN, image_url, description, bookshelf} = req.body;
    const SQL = "UPDATE books SET title=$1, author=$2, ISBN=$3, image_url=$4, description=$5, bookshelf=$6 WHERE id = $7";
    const values = [title, author, ISBN, image_url, description, bookshelf, id];

    client.query(SQL, values)
        .then(() => {
            res.redirect(`/books/${id}`)
        })
}

function deleteBook(req, res){
    console.log('IN DELETE METHOD');
    const id = req.params.id;
    const SQL = 'DELETE FROM books WHERE id=$1';
    const values = [id];

    client.query(SQL, values)
        .then(()=> {
            res.redirect('/');
        })
}

function renderNewSearch(req, res){
    res.render('pages/searches/new');
};

async function getSingleBook(request, response){
    let SQL = 'SELECT * FROM books WHERE id=$1;';
    const bookshelvesSQL = 'SELECT DISTINCT bookshelf FROM books;'
    let values = [request.params.id];

    let bookshelves = await client.query(bookshelvesSQL)
  
    client.query(SQL, values)
      .then(result => {
        response.render('pages/books/show', { books : result.rows, bookshelves: bookshelves.rows });
      })
      .catch(err => console.error(err));
}

async function addBook(request, response){
    try{
        let {title, author, ISBN, image_url, description, bookshelf} = request.body;

        //Add book to database
        let SQL = 'INSERT INTO books(title, author, ISBN, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;';
        let values = [title, author, ISBN, image_url, description.slice(0,255), bookshelf];

        const queryResponse = await client.query(SQL, values);
        const bookID = queryResponse.rows[0].id;

        response.redirect(`/books/${bookID}`);
        }
    catch(err){
        handleError(err);
    }
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
    res.status(404).send('This route does not exist');
}

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${PORT}`);
})