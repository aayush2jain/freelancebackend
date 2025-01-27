const Product = require('../models/product.model.js');
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const streamifier = require('streamifier');
const deleteProduct = async(req,res)=>{
     try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
}
const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
    try {
        if (!localFilePath) throw new Error("No file path provided");
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType, // Automatically detect or use "video" / "image"
        });
        // File successfully uploaded, remove the local file
        fs.unlinkSync(localFilePath);
        console.log("File successfully uploaded and local file removed:", response.secure_url);
        return response;
    } catch (error) {
        // Remove the local file even if the upload fails
        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        } catch (fsError) {
            console.error("Error removing local file:", fsError);
        }

        console.error("Error uploading to Cloudinary:", error);
        return null; // Return null to indicate failure
    }
};

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = (fileBuffer, resourceType) => {

  cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: resourceType }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
        // Convert buffer to stream and pipe it to Cloudinary
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};
// Create a new product
const createProduct = async (req, res) => {
    const { name, price, description, goalamount, category, timeDuration } = req.body;

    console.log("Product Data:", { name, price, description, goalamount,timeDuration,category });

    try {
        // Ensure req.files exists
        if (!req.files) {
            return res.status(400).json({ message: 'No files uploaded.' });
        }

        // Collect image URLs
        const imageUrls = [];
        for (let i = 1; i <= 4; i++) {
            const fileKey = `image${i}`;
            if (req.files[fileKey]) {
                console.log(`Uploading image ${fileKey}:`, req.files[fileKey][0].path);
                const uploadedImage = await uploadToCloudinary(req.files[fileKey][0].buffer, 'image');
                if (uploadedImage) {
                    imageUrls.push(uploadedImage.url);
                }
            }
        }

        // Upload brochure if available
        let brochureLink = null;
        if (req.files.brochure) {
            const uploadedBrochure = await uploadToCloudinary(req.files.brochure[0].buffer, 'image');
            brochureLink = uploadedBrochure?.url || null; 
        }

        console.log("Uploaded Images:", imageUrls);

        // Validate required fields
        // if (!name || !price || !description || !goalamount || !category || !timerDuration) {
        //     return res.status(400).json({ message: 'All fields are required.' });
        // }

        // Create a new product instance
        const newProduct = new Product({
            name,
            price,
            description,
            goalamount,
            category,
            image: imageUrls, // Array of uploaded image URLs
            timeDuration: timeDuration || 3600, // Default 1 hour if not provided
            startTime: new Date(), // Current timestamp
            brochure: brochureLink,
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();

        // Return the saved product as a response
        res.status(200).json(savedProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: 'Error creating product', error });
    }
};


const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({products})
    } catch (error) {
        console.log("error getting products",error);
        res.status(500).json({ message: "Failed to retrieve videos", error });
    }
};
const getProduct = async (req, res) => {
    console.log("Get Product Details");
    console.log("Product:", req.params);
    const { id } = req.params;
    console.log("Product ID:", id);

    try {
        // Fetch the product by ID from the database
        const product = await Product.findById(id);

        if (!product) {
            // If the product does not exist, return a 404 error
            return res.status(404).json({ message: 'Product not found' });
        }

        // Calculate elapsed time and remaining time
        const elapsedTime = Math.floor((new Date() - product.startTime) / 1000); // Elapsed seconds
        const remainingTime = Math.max(product.timeDuration - elapsedTime, 0);

        // Attach the remaining time to the product details
        const productWithTimer = {
            ...product.toObject(),
            remainingTime,
        };

        // Send the product details as the response
        res.status(200).json(productWithTimer);
    } catch (error) {
        console.error('Error fetching product:', error);

        // Return a 500 error for any server issues
        res.status(500).json({ message: 'Error fetching product details', error });
    }
};

module.exports = {
    createProduct,
    getAllProduct,
    deleteProduct,
    getProduct,
};
