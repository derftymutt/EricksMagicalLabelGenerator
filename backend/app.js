const express = require('express');

const app = express();

app.use('/api/companies', (req, res, next) => {

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
