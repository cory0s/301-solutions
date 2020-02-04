'use strict';

// Import dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Set express view engine
app.set('view engine', 'ejs');

// Setup middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

app.get('/', renderHome);

app.get('*', (err, res) => handleError(err, res));

function renderHome(req,res){
    res.render('pages/searches/new');
}

function handleError(err, res) {
    res.status(404).send('This route does not exist')
}

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${PORT}`);
})