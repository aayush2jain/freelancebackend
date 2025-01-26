const express = require('express');
const router = express.Router();
const { availableSlots,bookSlot} = require('../controllers/appointment.js');

router.get('/slots',availableSlots);
router.post('/book',bookSlot);

module.exports = router;