const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId:
     { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
     },
    username: { type: String },
    contact: { type: Number },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productname: { type: String, required: true },
    usermail: { type: String },
    productprice: { type: Number, required: true },
    pincode: { type: Number, required: true },
    quantity: { type: Number},
    address: { type: String, required: true },
    status: { type: String, required: true, enum: ['Incart', 'pending', 'delivered', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);