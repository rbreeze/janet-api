const mongoose = require('mongoose');

let itemCollectionSchema = mongoose.Schema({
	name: String,
  aliases: [{ value: String }],
	userId: String
});

module.exports = mongoose.model('itemCollection', itemCollectionSchema);