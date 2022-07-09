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

exports.brand_delete_get = function(req, res) {
  res.send('brand delete GET')
}

exports.brand_delete_post = function(req, res) {
  res.send('brand delete POST')
}

exports.brand_update_get = function(req, res) {
  res.send('brand update GET')
}

exports.brand_update_post = function(req, res) {
  res.send('brand update POST')
}
