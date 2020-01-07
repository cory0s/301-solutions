'use strict';

// Setup Handlebars template
let source = document.getElementById('photo-template').innerHTML;
let template = Handlebars.compile(source);

// Declare global vars
const horns = [];

// Load data from the data source file and create objects
function getData(){
    return $.get('../data/page-1.json', 'json');
}

function run(){
    getData()
        .then(data => data.forEach(obj => horns.push(new Creature(obj))))
        .then(() => horns.forEach(creature => creature.render()))
}

run();