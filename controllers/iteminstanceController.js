var ItemInstance = require('../models/iteminstance');

exports.iteminstance_list = function(req, res, next) {
  ItemInstance.find() // Return all ItemInstance objects
  .populate('item') // Replace the stored item id in each ItemInstance object with the full item document
  .exec(function(err, results) {
    if (err) {return next(err)}
    res.render('iteminstance_list', {
      title: 'Item Instance List',
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
      title: `Unit of ${iteminstance.item.name}`,
      iteminstance: iteminstance
    })
  })
}

exports.iteminstance_create_get = function(req, res) {
  res.send('iteminstance create GET')
}

exports.iteminstance_create_post = function(req, res) {
  res.send('iteminstance create POST')
}

exports.iteminstance_delete_get = function(req, res) {
  res.send('iteminstance delete GET')
}

exports.iteminstance_delete_post = function(req, res) {
  res.send('iteminstance delete POST')
}

exports.iteminstance_update_get = function(req, res) {
  res.send('iteminstance update GET')
}

exports.iteminstance_update_post = function(req, res) {
  res.send('iteminstance update POST')
}
