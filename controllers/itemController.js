var Item = require('../models/item');
var Brand = require('../models/brand');
var Style = require('../models/style');
var ItemInstance = require('../models/iteminstance');

var async = require('async');
const { body, validationResult } = require('express-validator');

exports.index = function(req, res, netx) {
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
        name: 'Local Atheletic Clothing E-Shop',
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
      name: 'Item List',
      item_list: results
    })
  })
}

exports.item_detail = function(req, res, next) {
  async.parallel(
    {
      item: function(cb) {
        Item.findById(req.params.id)
        .populate('brand')
        .populate('style')
        .exec(cb);
      },
      item_instance: function(cb) {
        ItemInstance.find({ 'item': req.params.id}).exec(cb)
      }
    },
    function(err, results) {
      if (err) {return next(err) }
      if (results.item==null) { // If there's no results
        var err = new Error("Item Not Found")
        err.status = 404
        return next(err)
      }
      res.render('item_detail', {
        name: results.item.name,
        item: results.item,
        item_instances: results.item_instance
        }
      )
    })
}

// Display item create form on GET.
exports.item_create_get = function(req, res, next) {

    // Get all brands and styles, which we can use for adding to our item.
    async.parallel({
        brands: function(callback) {
            Brand.find(callback);
        },
        styles: function(callback) {
            Style.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('item_form', { name: 'Add item', brands: results.brands, styles: results.styles });
    });

};

// Handle item create on POST.
exports.item_create_post = [
    // Convert the style to an array.
    (req, res, next) => {
        if(!(req.body.style instanceof Array)) {
            if(typeof req.body.style ==='undefined')
            req.body.style = [];
            else
            req.body.style = new Array(req.body.style);
        }
        next();
    },

    // Validate and sanitize fields.
    body('name', 'name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('brand', 'brand must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('category', 'category must not be empty').trim().isLength({ min: 1 }).escape(),
    body('style.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a item object with escaped and trimmed data.
        var item = new Item(
          { name: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            category: req.body.category,
            style: req.body.style
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all brands and styles for form.
            async.parallel({
                brands: function(callback) {
                    Brand.find(callback);
                },
                styles: function(callback) {
                    Style.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected styles as checked.
                for (let i = 0; i < results.styles.length; i++) {
                    if (item.style.indexOf(results.styles[i]._id) > -1) {
                        results.styles[i].checked='true';
                    }
                }
                res.render('item_form', {
                  name: 'Create item',
                  brands:results.brands,
                  styles:results.styles,
                  item: item,
                  errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save item.
            item.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new item record.
                   res.redirect(item.url);
                });
        }
    }
];

exports.item_update_get = function(req, res, next) {
  // Get item, brands and styles for form.
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id)
              .populate('brand')
              .populate('style')
              .exec(callback);
        },
        brands: function(callback) {
            Brand.find(callback);
        },
        styles: function(callback) {
            Style.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.item==null) { // No results.
                var err = new Error('item not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Important: Mark previously selected styles for the item as checked.
            for (var style = 0; style < results.styles.length; style++) {
                for (var style_for_item = 0; style_for_item < results.item.style.length; style_for_item++) {
                    if (results.styles[style]._id.toString()===results.item.style[style_for_item]._id.toString()) {
                        results.styles[style].checked='true';
                    }
                }
            }
            res.render('item_form', {
              name: 'Update item',
              brands: results.brands,
              styles: results.styles,
              item: results.item
            });
        });
}

exports.item_update_post = [
    // Convert the style to an array
    (req, res, next) => {
        if(!(req.body.style instanceof Array)){
            if(typeof req.body.style==='undefined')
            req.body.style=[];
            else
            req.body.style=new Array(req.body.style);
        }
        next();
    },

    // Validate and sanitize fields.
    body('name', 'name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('brand', 'brand must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('catebory', 'catebory must not be empty').trim().isLength({ min: 1 }).escape(),
    body('style.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a item object with escaped/trimmed data and old id.
        var item = new Item(
          { name: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            catebory: req.body.catebory,
            style: (typeof req.body.style==='undefined') ? [] : req.body.style,
            _id:req.params.id //IMPORTANT: This is required, or a new ID will be assigned
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all brands and styles for form.
            async.parallel({
                brands: function(callback) {
                    Brand.find(callback);
                },
                styles: function(callback) {
                    Style.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected styles as checked.
                for (let i = 0; i < results.styles.length; i++) {
                    if (item.style.indexOf(results.styles[i]._id) > -1) {
                        results.styles[i].checked='true';
                    }
                }
                res.render('item_form', {
                  name: 'Update item',
                  brands: results.brands,
                  styles: results.styles,
                  item: item,
                  errors: errors.array()
                });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Item.findByIdAndUpdate(req.params.id, item, {}, function (err,theitem) {
                if (err) { return next(err); }
                   // Successful - redirect to item detail page.
                   res.redirect(theitem.url);
                });
        }
    }
];
