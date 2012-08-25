var express = require('express')
  , glob = require('glob')
  , tracklist = require('tracklist');

var app = express();
var filesInfo = [];
var artists = {};

searchFiles('.');

app.get('/artists/', function(req,res){
	var results = [];
	for (prop in artists){
		results.push(prop);
	}
	res.json(results);
});

app.get('/artist/:string/tracks', function(req,res){
	var results = [];
	var searchString = (req.params.string ? req.params.string : "").toLowerCase();
	filesInfo.forEach(function(file){
		var searchField = file.artist.toLowerCase();
		if (searchField.indexOf(searchString) >= 0){
			results.push(file);
		}
	});
	res.json(results);
});

app.get('/tracks/search/:string', function(req,res){
	var results = [];
	var searchString = (req.params.string ? req.params.string : "").toLowerCase();
	filesInfo.forEach(function(file){
		var searchField = (file.title + " " + file.artist).toLowerCase();
		if (searchField.indexOf(searchString) >= 0){
			results.push(file);
		}
	});
	res.json(results);
});

app.post('/play/:id', function(req,res){
	var results = [];
	var file = filesInfo[req.params.id];

	// TODO, play this file

	res.json({ok:true}});
});


app.get('/', function(req, res){
	res.send('hello world');
});

function searchFiles(cwd) {

  options = {'cwd': cwd}
  glob("**/*.{mp3,mp4,m4a}", options, function (er, files) {

    files.forEach(function(filepath){
      console.log(cwd + '/' + filepath)      

      tracklist.list(cwd + '/' + filepath, function (err, result) {
        
        if(result) {

			console.log(result);
			filesInfo.push(result);
	    }

      });

    });

  });
}

app.listen(3000);
console.log ("server started...")