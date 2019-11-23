const express = require('express');

const CompanyController = require('../controllers/companies');

const router = express.Router();

router.post('', CompanyController.createCompany);

router.get('', CompanyController.getCompanies);

router.put('/:id', CompanyController.updateCompany);

router.delete('/:id', CompanyController.deleteCompany);

module.exports = router;
