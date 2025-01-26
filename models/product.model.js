const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    totalprice: {
        type: Number,
    },
    amount: {
        type: Number,
        default:0,
    },
    goalamount: {
        type: Number,
    },
    description: {
        type: String,
    },
    image: {
        type: [String],
    },
    category: {
        type: String,
    }
});

module.exports = mongoose.model('Product', productSchema);
