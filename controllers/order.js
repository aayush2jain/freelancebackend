const Order = require('../models/order.model.js');
const Product = require('../models/product.model.js')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // or 587 for TLS
  secure: true, // true for port 465, false for port 587
  service: 'gmail', // Use Gmail as the service (or your preferred email provider)
  auth: {
    user: 'aayushjain1290@gmail.com', // Your email address
    pass: 'jpdzvxmwrnfcymfx', 
  },
});
const createOrder = async (req, res) => {
    const {name, productId,productprice,usermail,productname,quantity,pincode ,contact,address,userId} = req.body; // Destructure the required fields from the request body

    console.log("order Data:", {name, productprice,quantity,productname,contact,address,userId });

    try {
        // Create a new product instance
        const newOrder = new Order({
            name,
            usermail,
            pincode,
            productprice,
            productname,
            contact,
            address,
            userId,
            quantity,
            productId
        });

        // Save the product to the database
        const savedOrder = await newOrder.save();

         const updatedProduct = await Product.findByIdAndUpdate(
            productId, 
            { $inc: { amount: quantity || 1 } }, // Increment by quantity or 1
            { new: true } // Return the updated product
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        if (savedOrder) {
      // Send order confirmation email
      const mailOptions = {
        from: 'aayushjain1290@gmail.com', // Sender email
        to: usermail,                     // Recipient email
        subject: 'Successful Payment and Accommodation Confirmation',
         html: `
          <p>Dear ${name},</p>
          <p>We are delighted to confirm that your payment was successful
</p>
        `, // Email body content
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      return res.status(200).json({ message: "You have successfully registered, and a confirmation email has been sent." });
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
    } catch (error) {
        // Handle errors and send a proper response
        console.error("Error creating product:", error);
        res.status(500).json({ message: 'Error creating product', error });
    }
};
const userOrder = async(req,res)=>{
    try {
        console.log("important",req.params.userId);
        const orders = await Order.find({userId:req.params.userId});
        console.log("orders",orders);
        return res.status(200).json({orders})
    } catch (error) {
        console.log("error getting orders",error);
        res.status(500).json({ message: "Failed to retrieve orders", error });
    }
}
module.exports ={
    createOrder,
    userOrder
}