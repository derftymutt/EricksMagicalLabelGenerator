const express = require('express');

const LabelTypeController = require('../controllers/label-types');

const router = express.Router();

router.post('', LabelTypeController.createLabelType);

router.get('', LabelTypeController.getLabelTypes);

router.put('/:id', LabelTypeController.updateLabelType);

router.delete('/:id', LabelTypeController.deleteLabelType);

module.exports = router;
