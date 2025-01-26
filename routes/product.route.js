const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require('path');
// const { register,loginUser } = require('../controllers/user.js');
const { createProduct,getAllProduct } = require('../controllers/product.js');
const { getProduct } = require('../controllers/product.js');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        cb(null, uploadPath);
    },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });
router.post(
  "/create",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  createProduct
);
router.get('/getall',getAllProduct);
router.get('/:id',getProduct);
module.exports = router;