const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  // Define your schema fields here
  name: String,
  price: Number,
  quantity: Number,
}, { collection: 'cart' });


module.exports = mongoose.model('CartItem', cartItemSchema);
