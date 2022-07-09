var async = require('async');
const { body, validationResult } = require('express-validator');

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

exports.style_create_get = function(req, res, next) {
  res.render('style_form', {
    title: 'Add Style'
  })
}

exports.style_create_post = [   // Note: An array of middleware functions
  // Validate and sanitize the name field
  body('name', 'Style name required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract validation errors from a request
    const errors = validationResult(req)
    // Create a new Style object with the trimmed and escaped data
    var style = new Style({
      name: req.body.name
    })
    // Render the form again with sanitized entered data / error messages when there are errors
    if (!errors.isEmpty()) {
      res.render('style_form', {
        title: 'Add Style',
        style: style,
        errors: errors.array()
      });
      return;
    // When the form data is valid
    } else {
      // Check if style with the provided name already exists
      Style.findOne({ 'name': req.body.name })
        .exec(function(err, found_style) {
            if (err) { return next(err) }
            if (found_style) {
              // Redirect to the corresponding style detail page if such style exists
              res.redirect(found_style.url)
            } else {
              style.save(function(err) {
                if (err) {return next(err)}
                // Redirect to style detail page too after saving the new style
                res.redirect(style.url)
              })
            }
        })
    }
  }
]

exports.style_delete_get = function(req, res, next) {
  res.send('style delete GET')
}

exports.style_delete_post = function(req, res, next) {
  res.send('style delete POST')
}

exports.style_update_get = function(req, res, next) {
  res.send('style update GET')
}

exports.style_update_post = function(req, res, next) {
  res.send('style update POST')
}
