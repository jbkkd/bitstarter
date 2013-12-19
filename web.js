var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();
app.use(express.logger());

var dir = './';
var filePath = path.join(__dirname, 'index.html');

app.get('/', function(request, response) {
  var file = fs.readFile(filePath);
  var fileContents = file.toString();
  response.send(fileContents);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
