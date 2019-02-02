const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const itemModel = require('./models/Item');
const itemCollectionModel = require('./models/Collection');
const router = express.Router()

// connect to mongoDB database
const MONGO_URL = "mongodb://localhost/hackathon"

mongoose.connect(MONGO_URL, { useNewUrlParser: true })
.catch((err) => { 
  console.log("Error connecting to database:")
  console.log(err) 
});

const app =  express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.send("The API is working!");
});

let getPrimaryCollectionName = async function(collectionName) {
	let collection = await itemCollectionModel.findOne({ $or: [ { name: collectionName }, { aliases: collectionName } ]})
	if (!collection) collectionName = "default"
	else collectionName = collection.name

	return collectionName
}

let getPrimaryItemName = async function(itemName) {
	let item = await itemModel.findOne({ $or: [ { name: itemName }, { aliases: itemName } ]})
	if (!item) itemName = "DNE"
	else itemName = item.name

	return itemName
}

/* ======  ITEM ROUTES ====== */

// Create an item
router.post('/:collection/item', async (req, res) => {

  let collectionName = await getPrimaryCollectionName(req.params.collection)

  itemCollectionModel.findOneAndUpdate({ name: collectionName }, { name: collectionName },
  	{ upsert: true, new: true },
  	(err, result) => {

  	if (err) res.send(err)
  	else if (!result) res.send("No collection with that name exists")
  	else {
  		let newItem = new itemModel(req.body)
  		newItem.collectionName = collectionName
  		newItem.save(function (err, data) {
	      if (err) res.send(err);
	      else res.send(data)
	    });
  	}
  });

});

// Get an item
router.get('/item/:collectionName?/:itemName', async (req, res) => {
  let item = await itemModel.findOne({ name: req.params.itemName, collectionName: req.params.collectionName })
  if (!item) res.send("That item doesn't exist")
  else res.send(item)
})

// Delete an item
router.delete('/item/:collectionName/:itemName', (req, res) => {
  res.send("Delete item")
})

// Get a random item
router.get('/item/:collectionName/random', function(req, res) {
  let collectionName = getPrimaryCollectionName(req.params.collectionName)
  res.send("random")
});

// Use an item
router.get('/item/:collectionName?/:itemName/use', async (req, res) => {

	let collectionName = await getPrimaryCollectionName(req.params.collectionName)

	let item = await itemModel.findOne({ name: req.params.itemName, collectionName: collectionName })

	if (!item) res.send("Item does not exist")
	else {
		item.used = true
		item.save((err, data) => {
			if (err) res.send(err)
			else res.send(data)
		})
	}

})

// Refresh an item
router.get('/item/:collectionName?/:itemName/refresh', async (req, res) => {

	let collectionName = await getPrimaryCollectionName(req.params.collectionName)

	let item = await itemModel.findOne({ name: req.params.itemName, collectionName: collectionName })

	if (!item) res.send("Item does not exist")
	else {
		item.used = false
		item.save((err, data) => {
			if (err) res.send(err)
			else res.send(data)
		})
	}
})

// See if item is in collection
router.get('/item/:collectionName?/:itemName/exists', async (req, res) => {
	var collectionName = req.params.collectionName
	let collection = await itemCollectionModel.findOne({ name: collectionName })
	if (!collection) collectionName = "default"

	let item = await itemModel.findOne({ name: req.params.itemName, collectionName: collectionName })
	res.send(!!(item))
})


/* ======  COLLECTION ROUTES ====== */

// Create a collection
router.post('/collection', function(req, res){
  let newItemCollection =  new itemCollectionModel(req.body);
  newItemCollection.save((err, data) => {
  	if (err) res.send(err)
  	else res.send(data)
  });
});

// Get all collections
router.get('/collections', function(req, res){
  let query = itemCollectionModel.find();
  query.exec((err, collections) => {
    res.send(collections);
  })
});

// Update a collection
router.put('/collection', (req, res) => {
  itemCollectionModel.findOneAndUpdate({ _id: req.body._id }, req.body, (err, data) => {
  	if (err) res.send(err)
  	else res.send(data)
  })
})

// Delete a collection
router.delete('/collection/:name', (req, res) => {
  itemCollectionModel.remove({ name: req.params.name }, (err, data) => {
  	if (err) res.send(err)
  	else res.send(data)
  })
})

/* ======  START THE SERVER ====== */

// prepend /api to routes
app.use('/api', router)

// Run the app on port 3000. 
app.listen(PORT, function(){
	console.log('Server is running on port 3000')
});


