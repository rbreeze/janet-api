const mongoose = require('mongoose');

let itemCollectionSchema = mongoose.Schema({
	name: String,
	aliases: [String],
	userId: String
});

module.exports = mongoose.model('itemCollection', itemCollectionSchema);