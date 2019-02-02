const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const models = require(__dirname + '/models/models.js');

itemModel = models.item;
itemCollectionModel = models.itemCollection;

const app =  express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.send("hello");
});

app.post('/api/addItem', function(req, res){
	let newItem = new itemModel({
		name: req.body.name,
		value: req.body.value,
		alias: req.body.alias,
		used: req.body.used,
		userId: req.body.userId
	});
	newItem.save();
	let collection = req.body.collection;
	let query = itemCollectionModel.findOne({ name: req.body.collection, userId: req.body.userId});
	query.exec(function (err, collection) {
		collection.items.push(newItem._id);
		collection.save(function (err) {
			if (err) return handleError(err);
		});
	};
});

app.post('/api/addCollection', function(req, res){
	let newItemCollection =  new itemCollectionModel(
	{
		name: req.body.name,
		userId: req.body.userId
	});

	newItemCollection.save();

});

app.get('/api/getCollections', function(req, res){
	let query = itemCollectionModel.find({userId: req.body.userId});
	query.exec(function(err, collections))
	{
		res.send(collections);
	}
});

app.get('/api/collections', function(req, res){
	let query = itemCollection.findById({userId : req.body.userId});
	let promise = query.exec();
	promise.addBack(function (err, docs) {});
});

// Run the app on port 3000. 
app.listen(PORT, function(){
	console.log('Server is running on port 3000')
});

