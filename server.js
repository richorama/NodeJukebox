var express = require('express');
var glob = require('glob');
var tracklist = require('tracklist');
var sys = require('util')
var childProcess = require('child_process');

var app = express();
var filesInfo = [];
var artists = {};
var genres = {};
var albums = {};
var playQueue = [];
var currentTrack = undefined;

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

	if (file) {
		console.log("queued " + file.Path);
		playQueue.push(file);
		play();
	}

	res.json({ok:true});
});

app.get('/Songs/Current/', function(req, res){
	res.json({});
});

app.get('/Queue/*/Tracks/', function(req, res){
	res.json(playQueue);
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
  var i = 0;
    files.forEach(function(filepath){
      console.log(cwd + '/' + filepath)      

      tracklist.list(cwd + '/' + filepath, function (err, result) {
        
        if(result) {
			//console.log(result);
			result.Id = i++;
			result.Path = cwd + '/' + filepath;
			filesInfo.push(result);
			index(result.genre, genres);
			index(result.artist, artists);
			index(result.album, albums);
	    }
      });
    });
  });
}

function done(error, stdout, stderr) 
{ 
	currentTrack = undefined;
	if (playQueue.length > 0){
		setTimeout(function(){ play(); }, 0);
	}
}

function play(){
	if (currentTrack){
		return;
	}
	currentTrack = playQueue.pop();	
	console.log("playing " + currentTrack.Path);
	childProcess.exec('mpg123 "' + currentTrack.Path + '"', done);
}

var port = process.env.port || 3000;
app.listen(port);
console.log("server started on port " + port);