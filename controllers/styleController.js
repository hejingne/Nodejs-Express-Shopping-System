var async = require('async');

var Item = require('../models/item');
var Style = require('../models/style');

exports.style_list = function(req, res, next) {
  Style.find()
  .sort([['name', 'ascending']])
  .exec(function(err, results) {
    if (err) {return next(err)}
    res.render('style_list', {
      title: 'Style List',
      style_list: results
    })
  })
}

exports.style_detail = function(req, res, next) {
  async.parallel(
    {
      style: function(cb) {
        Style.findById(req.params.id).exec(cb);
      },
      style_items: function(cb) {
        Item.find({
          'style': req.params.id
        })
        .populate('brand')
        .exec(cb)
      }
    },
    function (err, results) {
      if (err) {return next(err)}
      if (results.style==null) {  // If there's no results
        var err = new Error('Style Not Found')
        err.status = 404
        return next(err)
      }
      res.render('style_detail', {
        title: 'Style Detail',
        style: results.style,
        style_items: results.style_items
      })
    }
  )
}

exports.style_create_get = function(req, res) {
  res.send('style create GET')
}

exports.style_create_post = function(req, res) {
  res.send('style create POST')
}

exports.style_delete_get = function(req, res) {
  res.send('style delete GET')
}

exports.style_delete_post = function(req, res) {
  res.send('style delete POST')
}

exports.style_update_get = function(req, res) {
  res.send('style update GET')
}

exports.style_update_post = function(req, res) {
  res.send('style update POST')
}
