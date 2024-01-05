const OriginCompany = require('../models/origin-company');

exports.createOriginCompany = (req, res, next) => {
  const originCompany = new OriginCompany({
    name: req.body.name,
    address: req.body.address
  });

  originCompany.save()
    .then(addedOriginCompany => {
      res.status(201).json({ companyId: addedOriginCompany._id });
    });
};

exports.getOriginCompanies = (req, res, next) => {
  OriginCompany.find()
    .then(originCompanies => {
      res.status(200).json(originCompanies);
    });
};

exports.updateOriginCompany = (req, res, next) => {
  const originCompany = new OriginCompany({
    _id: req.body.id,
    name: req.body.name,
    address: req.body.address
  });

  OriginCompany.updateOne({ _id: req.params.id }, originCompany).then(result => {
    res.status(200).json(result);
  });
};

exports.deleteOriginCompany = (req, res, next) => {
  OriginCompany.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json('post deleted');
  });
};
