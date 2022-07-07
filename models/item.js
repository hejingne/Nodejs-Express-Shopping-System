var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
  {
    name: {type: String, required: true},
    brand: {type: Schema.Types.ObjectId, ref: 'Brand', required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    style: [
      {type: Schema.Types.ObjectId, ref: 'Style'}
    ]
  }
);

// Virtual for item's URL
ItemSchema.virtual('url').get(
  function() {
    return '/catalog/item/' + this._id;
  }
);

module.exports = mongoose.model('Item', ItemSchema);
