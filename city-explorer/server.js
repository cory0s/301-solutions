'use strict'

//load env variables from .env
require('dotenv').config();


//appplication dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');


//application setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

// this function creates new instance of Location object with user query information
function Location(query, res){
  this.search_query = query;
  this.formatted_query = res.body[0].display_name;
  this.latitude = res.body[0].lat;
  this.longitude = res.body[0].lon;
}

function searchToLatLong(query) {
  const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${query}&format=json`;

  return superagent.get(url)
    .then(res => {
      return new Location(query, res);
    })
    .catch(error => handleError(error));
}

// function to get weather data
function Weather(day){
  this.forecast = day.summary;
  this.time = new Date(day.time*1000).toString().slice(0,15);
}

// this function gets weather data based on json file info
function getWeather(request, response){
    console.log('WEATHER REQEUST ---------------------- ',request)
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.latitude},${request.query.longitude}`;
//   console.log('WEATHER URL ---------------------', url);

  return superagent.get(url)
    .then(result => {
      const weatherSummaries = result.body.daily.data.map(day => {
        return new Weather(day);
      });
      response.send(weatherSummaries);
    })
    .catch(error => handleError(error, response));
}

// Create meetup constructor
// new Date() toString();
function Meetups(event){
  //console.log('EVEN - MEETUP', event);
  this.link = event.link;
  //console.log(this.link);
  this.name = event.name;
  //console.log(this.name);
  this.creation_date = event.local_date;
  this.host = event.group.name;
}

// function to get meetup data based on api info
function getMeetup(request, response){
  const url = `https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&lon=${request.query.data.longitude}&radius=10&fields=20&lat=${request.query.data.latitude}&key=${process.env.MEETUP_API_KEY}`;
  //console.log('MEETUP URL', url);

  return superagent.get(url)
    .then(result => {
      const meetupSummaries = result.body.events.map(info => {
        return new Meetups(info);
      });
      response.send(meetupSummaries);
    })
    .catch(error => handleError(error, response));
}

// function to handle errors
function handleError(err, res) {
  console.error(err);
  if (res) res.status(500).send('Sorry, something went wrong');
}

// API routes
app.get('/location', (request, response) => {
  searchToLatLong(request.query.city)
    .then(location => response.send(location))
    .catch(error => handleError(error, response));
})

app.get('/weather', getWeather);

// app.get('/meetups', getMeetup);

// this uses express.js to callback to handleError function 
// handles incorrect path 
app.use('*', (err, res) => handleError(err, res));

//Make sure server is listening for requests
app.listen(PORT, () => console.log(`App is up on ${PORT}`));