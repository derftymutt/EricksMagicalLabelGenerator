const mongoose = require('mongoose');

const originCompanySchema = mongoose.Schema({
  name: { type: String, required: true },
  address: {
    street1: { type: String },
    street2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String }
  }
});

module.exports = mongoose.model('OriginCompany', originCompanySchema);
