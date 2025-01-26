const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'uploads', // Folder name in Cloudinary
        resource_type: 'auto', // Auto-detect file type (image, video, etc.)
        format: async (req, file) => {
            // Optional: Force file format (e.g., jpg, png)
            return 'auto';
        },
    },
});

// Create a Multer instance using Cloudinary storage
// const upload = multer({ storage });
// const { register,loginUser } = require('../controllers/user.js');
const { createProduct,getAllProduct } = require('../controllers/product.js');
const { getProduct } = require('../controllers/product.js');
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadDir = path.join(__dirname, 'uploads');
// // Ensure uploads directory exists
//     if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
//      }
//         cb(null, uploadPath);
//     },
//   filename: (req, file, cb) => {
//     cb(null, `${file.originalname}`);
//   },
// });


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