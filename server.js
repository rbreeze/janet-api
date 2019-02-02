const express = require('express');

let models = require(__dirname + 'models/models.js');
const app =  express();
const PORT = process.env.PORT || 3000;

app.get('/', function(req, res) {
  res.send("hello");
});


// Run the app on port 3000. 
app.listen(PORT, function(){
	console.log('Server is running on port 3000')
});

