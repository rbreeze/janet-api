const mongoose = require('mongoose');
const random = require('mongoose-simple-random')

let itemSchema = mongoose.Schema({
  name: String,
  value: String,
  aliases: [{ value: String }],
  used: {type: Boolean, default: false},
  userId: String, 
  collectionName: String
});

itemSchema.plugin(random)

module.exports = mongoose.model('item', itemSchema);
