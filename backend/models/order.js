const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  title: { type: String, required: true },
  labelCount: { type: Number, required: true },
  labelsPerPage: { type: Number, required: true },
  to: {
    name: { type: String },
    value: {
      id: { type: String },
      address: {
        street1: { type: String },
        street2: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String }
      },
      name: { type: String }
    },
    isHidden: { type: Boolean }
  },
  from: {
    name: { type: String },
    value: { type: String },
    isHidden: { type: Boolean }
  },
  dept: {
    name: { type: String },
    value: { type: String },
    isHidden: { type: Boolean }
  },
  madeIn: {
    name: { type: String },
    value: { type: String },
    isHidden: { type: Boolean }
  },
  purchaseOrder: {
    name: { type: String, required: true  },
    value: { type: String, required: true  },
    isHidden: { type: Boolean }
  },
  labelType: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    fields: [{
      name: {type: String, required: true}
    }]
  },
  labelFields: [
    [{
      name: { type: String, required: true },
      value: { type: String },
      isHidden: { type: Boolean },
      isAfterValue: { type: Boolean },
      isSpaceAbove: { type: Boolean }
    }]
  ]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
