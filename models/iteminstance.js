var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemInstanceSchema = new Schema(
  {
    item: {type: Schema.Types.ObjectId, ref: 'Item', required: true},
    status: {type: String, required: true, enum: ['Available', 'Out of Stock', 'Reserved']},
    due_clearance: {type: Date, default: Date.now}
  }
);

// Virtual for ItemInstance's URL
ItemInstanceSchema.virtual('url').get(
  function() {
    return '/catalog/iteminstance/' + this._id;
  }
);

module.exports = mongoose.model('ItemInstance', ItemInstanceSchema);
