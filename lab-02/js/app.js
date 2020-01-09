// 'use strict';

// // Setup Handlebars template
// let source = document.getElementById('photo-template').innerHTML;
// let template = Handlebars.compile(source);

// // Declare global vars
// const horns = [];
// const keywords = [];

// // Functions to get data and update keywords list
// function getData(){
//     return $.get('../data/page-1.json', 'json');
// }

// function updateKeywords(arr){
//     const select = $('select');
//     arr.forEach(keyword => select.append(`<option>${keyword}</option>`));
// }

// function renderCreatures(arr){
//     arr.forEach(creature => creature.render());
// }

// // Event handler for keyword selection
// $('select').on('change', function(e){
//     $('div').hide();
//     $(`div[class="${e.target.value}"]`).show();
// })

// // Get data, create creatures, update keywords, render
// function run(){
//     getData()
//         .then(data => data.forEach(obj => horns.push(new Creature(obj))))
//         .then(() => updateKeywords(keywords))
//         .then(() => renderCreatures(horns))
// }

// // async function run(){
// //     const data = await $.get('../data/page-1.json', 'json');
// //     data.forEach(creature => horns.push(creature));
// //     console.log(horns);
// // }

// $(run());


'use strict';

function Dog(dog) {
  this.name = dog.name;
  this.image_url = dog.image_url;
  this.hobbies = dog.hobbies;
}

Dog.allDogs = [];

Dog.prototype.render = function() {
  $('main').append('<div class="clone"></div>');
  let dogClone = $('div[class="clone"]');

  let dogHtml = $('#dog-template').html();

  dogClone.html(dogHtml);

  dogClone.find('h2').text(this.name);
  dogClone.find('img').attr('src', this.image_url);
  dogClone.find('p').text(this.hobbies);
  dogClone.removeClass('clone');
  dogClone.attr('class', this.name);
};
Dog.bark = () => {
    console.log('bark');
}

Dog.prototype.meow = () =>{
    console.log('meow');
}

Dog.readJson = () => {
  $.get('../data/page-1.json', 'json')
    .then(data => {
      data.forEach(item => {
        Dog.allDogs.push(new Dog(item));
      });
    })
    .then(Dog.loadDogs);
};

Dog.loadDogs = () => {
  Dog.allDogs.forEach(dog => dog.render());
};

$(() => Dog.readJson());