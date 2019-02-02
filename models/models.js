const mongoose = require('mongoose');

let itemSchema = new mongoose.Schema({
	name: String,
	value: String,
	alias: [String],
	used: {type: Boolean, default: false}
});

let itemCollectionSchema = new mongoose.Schema({
	name: String,
	items: [itemSchema],
	alias: [String]
})

let Item = module.exports = mongoose.model('Item', itemSchema);
let itemCollection = module.exports = mongoose.model('itemCollection', itemCollectionSchema);