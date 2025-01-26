const {Router} = require('express');
const router = Router();
const { adminSlot,updateStatus} = require('../controllers/appointment.js');
const {deleteProduct} = require('../controllers/product.js');
router.get('/bookings',adminSlot);
router.put('/bookings/:id',updateStatus);
router.delete('/product/:id',deleteProduct);
module.exports = router;