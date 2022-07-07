var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BrandSchema = new Schema(
  {
    name: {type: String, required: true, maxLength: 100},
    country: {type: String, required: true, maxLength: 20}
  }
);

BrandSchema.virtual('nameAndCountry').get(
  // To avoid errors in case where a brand doesn't have a name or country of origin,
  // we handle the exception by returning an empty string
  function() {
    var name = '';
    if (this.name && this.country) {
      name = this.name + ', ' + this.country;
    }
    return name;
  }
);

// The url virtual returns the absolute URL to get a particular instance of the model,
// which is useful when we need to get a link to a particular brand
BrandSchema.virtual('url').get(
  function() {
    return '/catalog/brand/' + this._id;
  }
);

module.exports = mongoose.model('Brand', BrandSchema);
