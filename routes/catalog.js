var express =  require('express');
var router = express.Router();

// Require controller modules
var item_controller = require('../controllers/itemController');
var brand_controller = require('../controllers/brandController');
var style_controller = require('../controllers/styleController');
var item_instance_controller = require('../controllers/iteminstanceController');

// Define routes
// Item routes
// GET catalog home page.
router.get('/', item_controller.index);

// GET request for creating an item. NOTE This must come before routes that display item (uses id).
router.get('/item/create', item_controller.item_create_get);

// POST request for creating item.
router.post('/item/create', item_controller.item_create_post);

// GET request to update item.
router.get('/item/:id/update', item_controller.item_update_get);

// POST request to update item.
router.post('/item/:id/update', item_controller.item_update_post);

// GET request for one item.
router.get('/item/:id', item_controller.item_detail);

// GET request for list of all item items.
router.get('/items', item_controller.item_list);

/// brand ROUTES ///

// GET request for creating brand. NOTE This must come before route for id (i.e. display brand).
router.get('/brand/create', brand_controller.brand_create_get);

// POST request for creating brand.
router.post('/brand/create', brand_controller.brand_create_post);

// GET request to delete brand.
router.get('/brand/:id/delete', brand_controller.brand_delete_get);

// POST request to delete brand.
router.post('/brand/:id/delete', brand_controller.brand_delete_post);

// GET request for one brand.
router.get('/brand/:id', brand_controller.brand_detail);

// GET request for list of all brands.
router.get('/brands', brand_controller.brand_list);

/// style ROUTES ///

// GET request for creating a style. NOTE This must come before route that displays style (uses id).
router.get('/style/create', style_controller.style_create_get);

//POST request for creating style.
router.post('/style/create', style_controller.style_create_post);

// GET request for one style.
router.get('/style/:id', style_controller.style_detail);

// GET request for list of all style.
router.get('/styles', style_controller.style_list);

/// iteminstance ROUTES ///

// GET request for creating an itemInstance. NOTE This must come before route that displays itemInstance (uses id).
router.get('/iteminstance/create', item_instance_controller.iteminstance_create_get);

// POST request for creating itemInstance.
router.post('/iteminstance/create', item_instance_controller.iteminstance_create_post);

// GET request for one itemInstance.
router.get('/iteminstance/:id', item_instance_controller.iteminstance_detail);

// GET request for list of all itemInstance.
router.get('/iteminstances', item_instance_controller.iteminstance_list);

module.exports = router;
