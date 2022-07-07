var Brand = require('../models/brand');

exports.brand_list = function(req, res) {
  res.send('brand list')
}

exports.brand_detail = function(req, res) {
  res.send(`brand detail for ${req.params.id}`)
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
