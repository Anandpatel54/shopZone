const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    title: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: String,
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    default: 'Cash on Delivery',
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
