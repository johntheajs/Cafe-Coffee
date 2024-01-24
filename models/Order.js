const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [Object],
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now },
},{ collection: 'order' });

module.exports = mongoose.model('Order', orderSchema);
