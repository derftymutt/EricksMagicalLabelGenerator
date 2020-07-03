const mongoose = require('mongoose');

const labelTypeSchema = mongoose.Schema({
  name: { type: String, required: true },
  fields: [{
    name: { type: String, required: true }
  }]
});

module.exports = mongoose.model('LabelType', labelTypeSchema);
