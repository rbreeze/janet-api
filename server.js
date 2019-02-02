const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const models = require(__dirname + '/models/models.js');
const router = express.Router()

itemModel = models.item;
itemCollectionModel = models.itemCollection;

const app =  express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.send("hello");
});

/* ======  ITEM ROUTES ====== */

// Create an item
router.post('/item', function(req, res){

  let newItem = new itemModel(req.body);
  newItem.save();

  let collection = req.body.collection;
  let query = itemCollectionModel.findOne({ name: req.body.collection, userId: req.body.userId});

  query.exec((err, collection) => {

    collection.items.push(newItem._id);
    collection.save(function (err) {
      if (err) return handleError(err);
    });

  });

});

router.get('/item', (req, res) => {
	res.send("Hello world!")
})

// Get an item
router.get('/item/:collectionName?/:itemName', (req, res) => {
  res.send("Get item")
})

// Update an item
router.put('/item', (req, res) => {
  res.send("Update item")
})

// Delete an item
router.delete('/item/:collectionName?/:itemName', (req, res) => {
  res.send("Delete item")
})

// Get a random item
router.get('/item/random', function(req, res) {
  res.send("Get random item")
});

// Use an item
router.get('/item/:collectionName?/:itemName/use', (req, res) => {
  res.send("Use item")
})

// Refresh an item
router.get('/item/:collectionName?/:itemName/refresh', (req, res) => {
  res.send("Refresh item")
})

// See if item is in collection
router.get('/item/:collectionName?/:itemName/exists', (req, res) => {
  res.send("Check if item exists")
})

/* ======  COLLECTION ROUTES ====== */

// Create a collection
router.post('/collection', function(req, res){
  let newItemCollection =  new itemCollectionModel(
  {
    name: req.body.name,
    userId: req.body.userId
  });

  newItemCollection.save();

});

// Get all collections
router.get('/collections', function(req, res){
  let query = itemCollectionModel.find({userId: req.body.userId});
  query.exec((err, collections) => {
    res.send(collections);
  })
});

// Update a collection
router.put('/collection', (req, res) => {
  res.send("Update collection")
})

// Delete a collection
router.delete('/collection/:name', (req, res) => {
  res.send("Delete collection")
})

/* ======  START THE SERVER ====== */

// prepend /api to routes
app.use('/api', router)

// Run the app on port 3000. 
app.listen(PORT, function(){
	console.log('Server is running on port 3000')
});


