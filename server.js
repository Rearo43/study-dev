'use strict';

require('dotenv').config();

const PORT = process.env.PORT || 3005;

const express = require('express');
// const superagent = require('superagent');
// const pg = require('pg');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.set('view engine', 'ejs');

app.get('/', home);
app.use('*', routeNotFound);
app.use(bigError);

function home(req, resp) {
  resp.status(200).render('pages/index');
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
