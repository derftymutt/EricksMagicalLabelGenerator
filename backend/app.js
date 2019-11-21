const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Company = require('./models/company');

const app = express();

mongoose.connect('mongodb+srv://allen:Sv2c7wgtD2RlLyy8@ericks-magical-label-generator-r1f36.mongodb.net/emlg?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch(() => {
    console.log('Connection to database FAILED');
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.post('/api/companies', (req, res, next) => {
  const company = new Company({
    name: req.body.name,
    address: req.body.address
  });

  company.save();

  res.status(201).json({
    message: 'success!!!!!'
  });
});

app.get('/api/companies', (req, res, next) => {

  const companies = [
    {
      name: 'Company 1',
      address: 'company 1 address',
      id: 123
    },
    {
      name: 'Company 2',
      address: 'company 2 address',
      id: 321
    }
  ]
  res.status(200).json(companies);
});

module.exports = app;
