var Style = require('../models/style');

exports.style_list = function(req, res) {
  res.send('style list')
}

exports.style_detail = function(req, res) {
  res.send(`style detail for ${req.params.id}`)
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
