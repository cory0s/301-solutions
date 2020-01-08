'use strict';

// Setup Handlebars template
let source = document.getElementById('photo-template').innerHTML;
let template = Handlebars.compile(source);

// Declare global vars
const horns = [];
const keywords = [];

// Functions to get data and update keywords list
function getData(){
    return $.get('../data/page-1.json', 'json');
}

function updateKeywords(arr){
    const select = $('select');
    arr.forEach(keyword => select.append(`<option>${keyword}</option`));
}

// Event handler for keyword selection
$('select').on('change', function(e){
    $('div').hide();
    $(`div[class="${e.target.value}"]`).show();
})

// Get data, create creatures, update keywords, render
function run(){
    getData()
        .then(data => data.forEach(obj => horns.push(new Creature(obj))))
        .then(() => updateKeywords(keywords))
        .then(() => horns.forEach(creature => creature.render()))
}

// async function run(){
//     const data = await $.get('../data/page-1.json', 'json');
//     data.forEach(creature => horns.push(creature));
//     console.log(horns);
// }

run();