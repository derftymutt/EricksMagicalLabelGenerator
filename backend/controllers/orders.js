const Order = require('../models/order');

exports.createOrder = (req, res, next) => {
  const order = new Order({
    title: req.body.title,
    labelCount: req.body.labelCount,
    labelsPerPage: req.body.labelsPerPage,
    to: req.body.to,
    from: req.body.from,
    dept: req.body.dept,
    madeIn: req.body.madeIn,
    purchaseOrder: req.body.purchaseOrder,
    labelType: req.body.labelType,
    labelFields: req.body.labelFields
  });

  order.save()
    .then(addedOrder => {
      res.status(201).json({ orderId: addedOrder._id });
    });
};

exports.getOrders = (req, res, next) => {
  Order.find()
    .then(orders => {
      res.status(200).json(orders);
    })
};

exports.getOrder = (req, res, next) => {
  Order.findById(req.params.id).then(order => {
    res.status(200).json(order);
  })
}

exports.deleteOrder = (req, res, next) => {
  Order.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json('Order deleted');
  });
};
