const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
  name: { type: String, required: true },
  address: {
    street1: { type: String },
    street2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String }
  }
});

module.exports = mongoose.model('Company', companySchema);
