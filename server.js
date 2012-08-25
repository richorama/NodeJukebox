var express = require('express');
var app = express();

var tracklist = require("tracklist");

tracklist.list(".", function (err, result) {
	console.log(results);
});

app.get('/', function(req, res){
	res.send('hello world');
});

app.listen(3000);