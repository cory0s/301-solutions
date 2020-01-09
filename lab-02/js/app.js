'use strict';

// Declare global vars
let keywords = [];
let currentPage = 'page-1';

// Functions to get data and update keywords list
function getData(){
    let jsonPage = `../data/${currentPage}.json`
    return $.get(jsonPage, 'json');
}

function updateKeywords(arr){
    $('option[class="keyword"]').remove();
    arr.forEach(keyword => $('select[class="keywords"]').append(`<option class="keyword">${keyword}</option>`));
}

function renderCreatures(arr){
    $('div').remove();
    arr.forEach(creature => $('main').append(creature.render()));
}

// Event handler for keyword selection
$('select').on('change', function(e){
    $('div').hide();
    $(`div[class="${e.target.value}"]`).show();
})

$('button').on('click', function(){
  if(this.id === 'previous-button'){
    currentPage = 'page-1';
  } else {
    currentPage = 'page-2';
  }
  
  run();
})

// Get data, create creatures, update keywords, render
function run(){
  const horns = [];
  keywords = [];
    getData()
        .then(data => data.forEach(obj => horns.push(new Creature(obj))))
        .then(() => updateKeywords(keywords))
        .then(() => renderCreatures(horns))
}

$(run());
