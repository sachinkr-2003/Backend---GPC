const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.get('/', auth, reportController.getAllReports);
router.post('/', auth, reportController.createReport);
router.get('/:id', auth, reportController.getReport);
router.put('/:id', auth, reportController.updateReport);
router.post('/:id/finalize', auth, reportController.finalizeReport);
router.post('/:id/send', auth, reportController.sendReportToCustomer);
router.delete('/:id', auth, reportController.deleteReport);

module.exports = router;
