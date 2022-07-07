var Item = require('../models/item');

exports.index = function(req, res) {
  res.send('Site home page')
}

exports.item_list = function(req, res) {
  res.send('item list')
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
