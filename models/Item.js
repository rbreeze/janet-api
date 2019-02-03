const mongoose = require('mongoose');

let itemSchema = mongoose.Schema({
  name: String,
  value: String,
  aliases: [{ value: String }],
  used: {type: Boolean, default: false},
  userId: String, 
  collectionName: String
});

module.exports = mongoose.model('item', itemSchema);
