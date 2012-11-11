var express = require('express')
  , glob = require('glob')
  , tracklist = require('tracklist');

var app = express();
var filesInfo = [];
var artists = {};
var genres = {};
var albums = {};

searchFiles('.');

app.get('/Artist/', function(req,res){
	res.json(enumerate(artists));
});


app.get('/Artist/:artist/Tracks', function(req,res){
	res.json(search(req.params.artist, "artist"));
});

app.get('/Genre/', function(req,res){
	res.json(enumerate(genres));
});

app.get('/Genre/:genre/Tracks', function(req,res){
	res.json(search(req.params.genre, "genre"));
});


app.get('/Album/', function(req,res){
	res.json(enumerate(albums));
});

app.get('/Album/:album/Tracks', function(req,res){
	res.json(search(req.params.album, "album"));
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

	res.json({ok:true});
});

app.get('/Songs/Current/', function(req, res){
	res.json({});
});

app.get('/', function(req, res){
	res.sendfile('default.htm');
});

function enumerate(dictionary){
	var results = [];
	for (var prop in dictionary){
		results.push(prop);
	}
	return results;
}

function search(searchString, field){
	var results = [];
	var searchString = (searchString ? searchString : "").toLowerCase();
	filesInfo.forEach(function(file){
		var searchField = file[field].toLowerCase();
		if (searchField.indexOf(searchString) >= 0){
			results.push(file);
		}
	});
	return results;
}

function index(value, dictionary){
	var value = value.toLowerCase();
	if (value != ""){
		if (dictionary[value]){
			dictionary[value] += 1;
		} else {
			dictionary[value] = 1;				
		}
	}
}

function searchFiles(cwd) {

  options = {'cwd': cwd}
  glob("**/*.{mp3,mp4,m4a}", options, function (er, files) {

    files.forEach(function(filepath){
      console.log(cwd + '/' + filepath)      

      tracklist.list(cwd + '/' + filepath, function (err, result) {
        
        if(result) {
			console.log(result);
			filesInfo.push(result);
			index(result.genre, genres);
			index(result.artist, artists);
			index(result.album, albums);
	    }
      });
    });
  });
}

var port = process.env.port || 3000;
app.listen(port);
console.log("server started on port " + port);