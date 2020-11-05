const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const serverRoute = require('./routes/serverRoute.js');

const app = express();

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'view')));
app.use(express.static(path.join(__dirname, 'view/assets')));

const indexView = fs.readFileSync(`${__dirname}/view/index.html`, 'utf-8');

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
	next();
});

app.use(express.static('view'));

app.use('/', serverRoute);

app.use('/', (req, res) => {
	res.writeHead(200, {
		'Content-Type': 'text/html',
	});
	res.end(indexView);
});

// app.use(express.static(path.join(__dirname, 'view/index.html')));

module.exports = app;
