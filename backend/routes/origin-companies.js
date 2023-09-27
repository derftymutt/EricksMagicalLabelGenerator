const express = require('express');

const OriginCompanyController = require('../controllers/origin-companies');

const router = express.Router();

router.post('', OriginCompanyController.createOriginCompany);

router.get('', OriginCompanyController.getOriginCompanies);

router.put('/:id', OriginCompanyController.updateOriginCompany);

router.delete('/:id', OriginCompanyController.deleteOriginCompany);

module.exports = router;
