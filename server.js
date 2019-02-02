const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const models = require(__dirname + '/models/models.js');
const router = express.Router()

// connect to mongoDB database
const MONGO_URL = "mongodb://localhost/hackathon"

mongoose.connect(MONGO_URL, { useNewUrlParser: true })
.catch((err) => { 
  console.log("Error connecting to database:")
  console.log(err) 
});

itemModel = models.item;
itemCollectionModel = models.itemCollection;

const app =  express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.send("hello");
});

/* ======  ITEM ROUTES ====== */

// Create an item
router.post('/item', (req, res) => {

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

/* ===== IAN ===== */
// Get an item
router.get('/item/:collectionName?/:itemName', (req, res) => {
  res.send(req.params.collectionName)
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
router.get('/item/random', (req, res) => {
  res.send("Get random item")
});

// Use an item
router.get('/item/:collectionName?/:itemName/use', (req, res) => {

  let query = itemCollectionModel.findOne({ name:req.params.collectionName});
  query.exec((err, collection) => {

    let query2 = collection.items.findOne({name: req.params.itemName});
    query2.exec((err, item) => {

      let query3 = itemModel.findOne({_id : item._id});
      query.exec((err, singleItem) => {

        singleItem.used = true;
        singleItem.save(function (err) {
          if (err) return handleError(err);
        });

      });
      item.save(function (err) {
        if (err) return handleError(err);
      });

    });
    collection.save(function (err) {
      if (err) return handleError(err);
    });

  });

})

// Refresh an item
router.get('/item/:collectionName?/:itemName/refresh', (req, res) => {
  let query = itemCollectionModel.findOne({ name:req.params.collectionName});
  query.exec((err, collection) => {
    
    let query2 = collection.items.findOne({name: req.params.itemName});
    query2.exec((err, item) => {

      let query3 = itemModel.findOne({_id : item._id});
      query.exec((err, singleItem) => {

        singleItem.used = false;
        singleItem.save(function (err) {
          if (err) return handleError(err);
        });

      });
      item.save(function (err) {
        if (err) return handleError(err);
      });

    });
    collection.save(function (err) {
      if (err) return handleError(err);
    });

  });
})

// See if item is in collection
router.get('/item/:collectionName?/:itemName/exists', async (req, res) => {
	var collectionName = req.params.collectionName
	let collection = await itemCollectionModel.findOne({ name: collectionName })
	if (!collection) collectionName = "default"

	let item = await itemModel.findOne({ name: req.params.itemName, collectionName: collectionName })
	return !!(item)
})

// aliases = [ { name : "foo" }, { name: "bar" }]
// itemModel.find({ $or : aliases })

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


