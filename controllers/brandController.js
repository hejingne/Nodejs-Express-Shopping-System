var Brand = require('../models/brand');
var Item = require('../models/item');

var async = require('async');
const { body, validationResult } = require('express-validator');

exports.brand_list = function(req, res, next) {
  Brand.find()
  .sort([['name', 'ascending']])
  .exec(function(err, results) {
    if (err) {return next(err)}
    res.render('brand_list', {
      title: 'Designer List',
      brand_list: results
    })
  })
}

exports.brand_detail = function(req, res, next) {
  async.parallel(
    {
      brand: function(cb) {
        Brand.findById(req.params.id).exec(cb)
      },
      brand_items: function(cb) {
        Item.find( {'brand': req.params.id}, 'name description' ).exec(cb)
      }
    },
    function(err, results) {
      if (err) {return next(err)}
      if (results.brand==null) {
        var err = new Error('Designer Not Found')
        err.status = 404
        return next(err)
      }
      res.render('brand_detail', {
        title: "Designer Detail",
        brand: results.brand,
        brand_items: results.brand_items
        }
      )
    }
  )
}

exports.brand_create_get = function(req, res, next) {
  res.render('brand_form', {
    title: 'Add Designer'
  })
}

exports.brand_create_post = [
  body('name').trim().isLength({ min: 1 })
    .escape().withMessage('Name must be specified')
    .isAlphanumeric().withMessage('Name can not contain non-alphanumeric characters'),

  body('country').trim().isLength({ min: 1 }).escape().withMessage('Country name must be specified'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('brand_form', {
        title: 'Add Designer',
        brand: req.body,
        errors: errors.array()
      });
      return;
    } else {
      var brand = new Brand({
        name: req.body.name,
        country: req.body.country
      })
      brand.save(function(err) {
        if (err) {return next(err)}
        res.redirect(brand.url)
      })
    }
  }
]

exports.brand_delete_get = function(req, res, next) {
  async.parallel({
        brand: function(callback) {
            Brand.findById(req.params.id).exec(callback)
        },
        brands_items: function(callback) {
            Item.find({ 'brand': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.brand==null) { // No results.
            res.redirect('/catalog/brands');
        }
        res.render('brand_delete', {
           title: 'Delete Brand',
           brand: results.brand,
           brand_items: results.brands_items
         } );
    });
}

exports.brand_delete_post = function(req, res, next) {
  async.parallel({
    brand: function(callback) {
      Brand.findById(req.body.brandid).exec(callback)
    },
    brands_items: function(callback) {
      Item.find({ 'brand': req.body.brandid }).exec(callback)
    },
}, function(err, results) {
    if (err) { return next(err); }
    // Success
    if (results.brands_items.length > 0) {
        // brand has items. Render in same way as for GET route.
        res.render('brand_delete', {
         title: 'Delete brand',
         brand: results.brand,
         brand_items: results.brands_items
       });
        return;
    }
    else {
        // brand has no items. Delete object and redirect to the list of brands.
        Brand.findByIdAndRemove(req.body.brandid, function deletebrand(err) {
            if (err) { return next(err); }
            // Success - go to brand list
            res.redirect('/catalog/brands')
        })
    }
});
}
