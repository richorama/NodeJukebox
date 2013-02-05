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

app.get('/Current/*', function(req, res){
	res.json(currentTrack);
});

app.get('/Popular/*', function(req, res){
	var results = [];
	filesInfo.forEach(function(track){
		if (track.plays > 0){
			results.push(track);
		}
	});
	results.sort(function(a,b){b.plays - a.plays});
	res.json(results);
});


app.get('/Song/:id', function(req, res){
	res.json(filesInfo[req.params.id]);
});

app.get('/Queue/*/Tracks/', function(req, res){
	res.json(playQueue);
});

app.get('/', function(req, res){
	res.sendfile('default.htm');
});

app.get('/Download/:id/download.mp3', function(req, res){
	res.sendfile(filesInfo[req.params.id].Path);
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

if (process.argv.length > 2){
	for(var i = 2; i < process.argv.length; i++){
		searchFiles(process.argv[i]);		
	}
} else {
	searchFiles(process.env.HOME || ".");		
}



function searchFiles(cwd) {
  var options = {cwd: cwd, nonull: false, nocase: true, root: "."};
  glob("**/*.mp3", options, function (error, files) {
  	if (error) {
  		console.error(error);
  	}
  	console.log(files.length + " tracks found");
    files.forEach(function(filepath){

    	console.log(filepath)
      	tracklist.list(cwd + '/' + filepath, function (err, result) {

        if(result) {
        	result.plays = 0;
			result.Id = filesInfo.length;
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
	currentTrack.plays += 1;
	console.log("playing " + currentTrack.Path);
	childProcess.exec('mpg123 "' + currentTrack.Path + '"', done);
}

var port = process.env.port || 1337;
app.listen(port);
console.log("server started on port " + port);