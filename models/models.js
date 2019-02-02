const mongoose = require('mongoose');

let itemSchema = new mongoose.Schema({
	name: String,
	value: String,
	alias: [String],
	used: {type: Boolean, default: false},
	userId: String
});

let itemCollectionSchema = new mongoose.Schema({
	name: String,
	items: [String],
	alias: [String],
	userId: String
});

let item = module.exports = mongoose.model('item', itemSchema);
let itemCollection = module.exports = mongoose.model('itemCollection', itemCollectionSchema);