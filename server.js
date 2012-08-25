var express = require('express')
  , glob = require('glob')
  , tracklist = require('tracklist');

var app = express();
var filesInfo = new Array();

searchFiles('.');


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