const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0,
  },
  discountPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Electronics', 'Fashion', 'Shoes', 'Mobiles', 'Laptops', 'Watches', 'Accessories', 'Home', 'Other'],
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  images: [{
    type: String,
  }],
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
