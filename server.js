var express = require('express')
  , glob = require('glob');

var app = express();
var files_info = new Array();

searchFiles('/Users/danhigham/Music');

app.get('/', function(req, res){
  res.send('hello world');
});

function searchFiles(cwd) {

  options = {'cwd': cwd}
  glob("**/*.{mp3,mp4,m4a}", options, function (er, files) {


    console.log(files);

  });
}



app.listen(3000);