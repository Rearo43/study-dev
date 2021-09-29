'use strict';

require('dotenv').config();

const PORT = process.env.PORT || 3005;

const express = require('express');
const superagent = require('superagent');
// const pg = require('pg');
const morgan = require('morgan');

// const client = new pg.Client(process.env.)

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.set('view engine', 'ejs');

app.get('/', movies);
app.use('*', routeNotFound);
app.use(bigError);

// function home(req, res) {
//   res.status(200).render('pages/index');
// }

function movies(req, resp) {
  const API = 'https://api.themoviedb.org/3/search/movie';

  let qObject = {
    api_key: process.env.MOVIES,
    query: req.query.search_query,
  };

  superagent
    .get(API)
    .query(qObject)
    .then((getMovies) => {
      let moviesArr = getMovies.body.results.map((movie) => {
        return new Movies(movie);
      });

      resp.status(200).json(moviesArr);
    })
    .catch(() => resp.status(500).send('Movies Broken!'));
}

function Movies(info) {
  this.title = info.original_title;
  this.overview = info.overview;
  this.average_votes = info.vote_average;
  this.total_votes = info.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${info.poster_path}`;
  this.popularity = info.popularity;
  this.released_on = info.release_date;
}

//----------404 Error
function routeNotFound(req, res) {
  res.status(404).send('Route NOT Be Found!');
}

//----------All Errors minus 404
function bigError(error, res) {
  console.log(error);
  res.status(error).send('BROKEN!');
}

//----------Connect to Server and Database
app.listen(PORT, () => console.log(`WORKING!: ${PORT}`));
