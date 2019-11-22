const express = require('express');

const Company = require('../models/company');

const router = express.Router();

router.post('', (req, res, next) => {
  const company = new Company({
    name: req.body.name,
    address: req.body.address
  });

  company.save()
    .then(addedCompany => {
      res.status(201).json({ companyId: addedCompany._id });
    });
});

router.get('', (req, res, next) => {
  Company.find()
    .then(companies => {
      res.status(200).json(companies);
    });
});

router.put('/:id', (req, res, next) => {
  const company = new Company({
    _id: req.body.id,
    name: req.body.name,
    address: req.body.address
  });

  Company.updateOne({ _id: req.params.id }, company).then(result => {
    res.status(200).json('update successful');
  });
});

router.delete('/:id', (req, res, next) => {
  Company.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json('post deleted');
  });
});

module.exports = router;
