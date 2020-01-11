'use strict';

// Declare global vars
let horns = [];
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
$('select[class="keywords"]').on('change', function(e){
    $('div').hide();
    $(`div[class="${e.target.value}"]`).show();
});

$('select[class="sort"]').on('change', function(e){
  if(e.target.value === 'name'){
    horns.sort((a,b) => a.name.localeCompare(b.name));
    renderCreatures(horns);
  } else {
    horns.sort((a,b) => a.horns - b.horns);
    renderCreatures(horns);
  }
});

// Pagination event listener
$('button').on('click', function(){
  if(this.id === 'previous-button'){
    currentPage = 'page-1';
  } else {
    currentPage = 'page-2';
  }

  $('select[class="sort"] option').prop('selected', function() {
    return this.defaultSelected;
  });
  
  run();
});

// Get data, create creatures, update keywords, render
function run(){
  horns = [];
  keywords = [];
    getData()
        .then(data => data.forEach(obj => horns.push(new Creature(obj))))
        .then(() => updateKeywords(keywords))
        .then(() => renderCreatures(horns))
}

$(run());
