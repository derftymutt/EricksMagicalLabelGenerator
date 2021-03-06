const LabelType = require('../models/label-type');

exports.createLabelType = (req, res, next) => {
  const labelType = new LabelType({
    name: req.body.name,
    fields: req.body.fields
  });

  labelType.save()
    .then(addedLabelType => {
      res.status(201).json({ labelTypeId: addedLabelType._id });
    });
};

exports.getLabelTypes = (req, res, next) => {
  LabelType.find()
    .then(labelTypes => {
      res.status(200).json(labelTypes);
    });
};

exports.updateLabelType = (req, res, next) => {
  const labelType = new LabelType({
    _id: req.body.id,
    name: req.body.name,
    fields: req.body.fields
  });

  LabelType.updateOne({ _id: req.params.id }, labelType).then(result => {
    console.log(result);
    if (result.nModified > 0) {
      res.status(200).json(result);
    } else {
      res.status(400).json({message: 'no changes'});
    }
  });
};

exports.deleteLabelType = (req, res, next) => {
  LabelType.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json('label type deleted');
  });
};
