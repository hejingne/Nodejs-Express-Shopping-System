#! /usr/bin/env node

console.log('This script populates some test items, brands, styles and iteminstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://hejingne:Comeon0922@cluster1.3jyzg.mongodb.net/online_shop?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Brand = require('./models/brand')
var Style = require('./models/style')
var ItemInstance = require('./models/iteminstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var brands = []
var styles = []
var items = []
var iteminstances = []

function brandCreate(name, country, cb) {
  branddetail = {name:name , country: country }

  var brand = new Brand(branddetail);

  brand.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New brand: ' + brand);
    brands.push(brand)
    cb(null, brand)
  }  );
}

function styleCreate(name, cb) {
  var style = new Style({ name: name });

  style.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New style: ' + style);
    styles.push(style)
    cb(null, style);
  }   );
}

function itemCreate(name, description, category, brand, style, cb) {
  itemdetail = {
    name: name,
    description: description,
    brand: brand,
    category: category
  }
  if (style != false) itemdetail.style = style

  var item = new Item(itemdetail);
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}


function itemInstanceCreate(item, due_clearance, status, cb) {
  iteminstancedetail = {
    item: item
  }
  if (due_clearance != false) iteminstancedetail.due_clearance = due_clearance
  if (status != false) iteminstancedetail.status = status

  var iteminstance = new ItemInstance(iteminstancedetail);
  iteminstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING itemInstance: ' + iteminstance);
      cb(err, null)
      return
    }
    console.log('New itemInstance: ' + iteminstance);
    iteminstances.push(iteminstance)
    cb(null, item)
  }  );
}


function createstylebrands(cb) {
    async.series([
        function(callback) {
          brandCreate('Patrick', 'Canada', callback);
        },
        function(callback) {
          brandCreate('Ben', 'Canada', callback);
        },
        function(callback) {
          brandCreate('Isaac', 'Canada', callback);
        },
        function(callback) {
          brandCreate('Bob', 'U.S.A', callback);
        },
        function(callback) {
          brandCreate('Jim', 'Mexico', callback);
        },
        function(callback) {
          styleCreate("Contemporary", callback);
        },
        function(callback) {
          styleCreate("Casual", callback);
        },
        function(callback) {
          styleCreate("Formal", callback);
        },
        ],
        // optional callback
        cb);
}


function createitems(cb) {
    async.parallel([
        function(callback) {
          itemCreate("Tote Bag", "Chic", "Bags", brands[4], [styles[0],styles[1]], callback);
        },
        function(callback) {
          itemCreate("Denim Jacket", "Durable", "Jackets / Coats", brands[0], [styles[0],], callback);
        },
        function(callback) {
          itemCreate("Black Loafers", "Never Out-dated", "Shoes", brands[0], [styles[0],], callback);
        },
        function(callback) {
          itemCreate("V-Neck T-shirt", "Goes With Everything", "Tops", brands[1], [styles[1],], callback);
        },
        function(callback) {
          itemCreate("Jeans", "Cute", "Bottoms", brands[1], [styles[1],], callback);
        },
        function(callback) {
          itemCreate("Dad-Style Shorts", "Chic", "Bottoms", brands[4], [styles[0],styles[1]], callback);
        },
        function(callback) {
          itemCreate("Purse", "Durable", "Accessories", brands[4], false, callback)
        }
        ],
        // optional callback
        cb);
}


function createiteminstances(cb) {
    async.parallel([
        function(callback) {
          itemInstanceCreate(items[0], false, 'Available', callback)
        },
        function(callback) {
          itemInstanceCreate(items[1], false, 'Out of Stock', callback)
        },
        function(callback) {
          itemInstanceCreate(items[2], false, "Reserved", callback)
        },
        function(callback) {
          itemInstanceCreate(items[3], false, 'Available', callback)
        },
        function(callback) {
          itemInstanceCreate(items[3], false, 'Available', callback)
        },
        function(callback) {
          itemInstanceCreate(items[3], false, 'Available', callback)
        },
        function(callback) {
          itemInstanceCreate(items[4], false, 'Available', callback)
        },
        function(callback) {
          itemInstanceCreate(items[4], false, 'Reserved', callback)
        },
        function(callback) {
          itemInstanceCreate(items[4], false, 'Out of Stock', callback)
        },
        function(callback) {
          itemInstanceCreate(items[0], false, "Available", callback)
        },
        function(callback) {
          itemInstanceCreate(items[1], false, "Available", callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createstylebrands,
    createitems,
    createiteminstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('iteminstances: '+iteminstances);

    }
    // All done, disconnect from database
    mongoose.connection.close();
});
