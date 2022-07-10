var ItemInstance = require('../models/iteminstance');
const { body, validationResult } = require('express-validator');

var Item = require('../models/item');

exports.iteminstance_list = function(req, res, next) {
  ItemInstance.find() // Return all ItemInstance objects
  .populate('item') // Replace the stored item id in each ItemInstance object with the full item document
  .exec(function(err, results) {
    if (err) {return next(err)}
    res.render('iteminstance_list', {
      name: 'Item Instance List',
      iteminstance_list: results
    })
  })
}

exports.iteminstance_detail = function(req, res, next) {
  ItemInstance.findById(req.params.id)
  .populate('item')
  .exec(function(err, iteminstance) {
    if (err) {return next(err)}
    if (iteminstance==null) { // If there's no such iteminstance
      var err = new Error("Item Instance Not Found")
      err.status = 404
      return next(err)
    }
    res.render('iteminstance_detail', {
      name: `Unit of ${iteminstance.item.name}`,
      iteminstance: iteminstance
    })
  })
}

exports.iteminstance_create_get = function(req, res, next) {
    Item.find({},'name')
    .exec(function (err, items) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('iteminstance_form', {name: 'Create ItemInstance', item_list: items});
    });

};

exports.iteminstance_create_post = [

    // Validate and sanitize fields.
    body('item', 'Item must be specified').trim().isLength({ min: 1 }).escape(),
    body('status').escape(),
    body('due_clearance', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a ItemInstance object with escaped and trimmed data.
        var iteminstance = new ItemInstance(
          { item: req.body.item,
            status: req.body.status,
            due_clearance: req.body.due_clearance
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Item.find({},'name')
                .exec(function (err, items) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('iteminstance_form', {
                      name: 'Create ItemInstance',
                      item_list: items,
                      selected_item: iteminstance.item._id,
                      errors: errors.array(),
                      iteminstance: iteminstance });
            });
            return;
        }
        else {
            // Data from form is valid.
            iteminstance.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect(iteminstance.url);
                });
        }
    }
];
