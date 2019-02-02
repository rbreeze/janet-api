const mongoose = require('mongoose');

let itemSchema = new mongoose.Schema({
	name: String,
	value: String,
	alias: [String]
});

let itemCollectionSchema = new mongoose.Schema({
	name: String,
	items: [itemSchema],
	alias: [String]
})

models.export = mongoose.model('Item', )