var Item = require('../models/item');
var Brand = require('../models/brand');
var Style = require('../models/style');
var ItemInstance = require('../models/iteminstance');

var async = require('async');

exports.index = function(req, res) {
  async.parallel( // All functions from below will start at the same time,
            // and when all of them have completed, the final callback function is invoked with
            // those counts in the results param (or err out)
    {
      item_count: function(cb) {
        Item.countDocuments({}, cb) // Pass {} as match condition to find all documents of this collection
      },
      item_instance_count: function(cb) {
        ItemInstance.countDocuments({}, cb)
      },
      item_instance_available_count: function(cb) {
        ItemInstance.countDocuments({status: 'Available'}, cb)
      },
      brand_count: function(cb) {
        Brand.countDocuments({}, cb)
      },
      style_count: function(cb) {
        Style.countDocuments({}, cb)
      }
    },
    function(err, results) {
      res.render('index', { // Render a view named 'index' with an obj of data to be inserted into the template
        title: 'Local Atheletic Clothing E-Shop',
        error: err,
        data: results
      });
    }
  );
};

exports.item_list = function(req, res, next) {
  Item.find({}, 'name brand description category style')
  .sort({name: 1})
  .populate('brand')  // Replace the stored item brand id with the full brand details
  .exec(function(err, results) {
    if (err) {return next(err) }
    res.render('item_list', {
      title: 'Item List',
      item_list: results
    })
  })
}

exports.item_detail = function(req, res) {
  res.send(`item detail for ${req.params.id}`)
}

exports.item_create_get = function(req, res) {
  res.send('item create GET')
}

exports.item_create_post = function(req, res) {
  res.send('item create POST')
}

exports.item_delete_get = function(req, res) {
  res.send('item delete GET')
}

exports.item_delete_post = function(req, res) {
  res.send('item delete POST')
}

exports.item_update_get = function(req, res) {
  res.send('item update GET')
}

exports.item_update_post = function(req, res) {
  res.send('item update POST')
}
