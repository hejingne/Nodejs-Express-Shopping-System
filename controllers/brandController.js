var Brand = require('../models/brand');
var Item = require('../models/item');

var async = require('async');

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

exports.brand_create_get = function(req, res) {
  res.send('brand create GET')
}

exports.brand_create_post = function(req, res) {
  res.send('brand create POST')
}

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
