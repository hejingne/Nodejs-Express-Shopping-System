var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StyleSchema = new Schema(
  {
    name: {type: String, required: true, maxLength: 20}
  }
);

// Virtual for Style's URL
StyleSchema.virtual('url').get(
  function() {
    return '/catalog/style/' + this._id;
  }
);

module.exports = mongoose.model('Style', StyleSchema);
