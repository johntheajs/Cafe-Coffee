const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/cafe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Models
const CartItem = require("./models/cartItem.js"); // Import your models

// Routes
app.post('/add-to-cart', async (req, res) => {
  const { name, price, quantity } = req.body;

  try {
    const cartItem = new CartItem({ name, price, quantity });
    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: 'Error adding item to cart' });
  }
});

app.get('/get-cart-items', async (req, res) => {
  try {
    // Fetch all cart items from the database
    const cartItems = await CartItem.find({});

    // Map the database items to a more convenient format (grouping by name)
    const cartItemsWithQuantity = {};

    cartItems.forEach(item => {
      const { name, price, quantity } = item;

      if (cartItemsWithQuantity[name]) {
        // If the item already exists, increase its quantity
        cartItemsWithQuantity[name].quantity += quantity;
      } else {
        // If it's a new item, add it to the object
        cartItemsWithQuantity[name] = {
          name,
          price,
          quantity,
        };
      }
    });

    // Convert the object values back to an array
    const cartItemsArray = Object.values(cartItemsWithQuantity);

    res.status(200).json(cartItemsArray);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cart items in nodejs' });
  }
});

// Update the route to handle updating cart item quantity
app.put('/update-cart-item/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  const updatedQuantity = req.body.quantity;

  try {
    const updatedItem = await CartItem.findByIdAndUpdate(itemId, { quantity: updatedQuantity }, { new: true });
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: 'Error updating cart item' });
  }
});

app.delete('/delete-cart-item/:itemName', async (req, res) => {
  const itemName = req.params.itemName;





  
  try {
    // Use the deleteOne method to remove the item from the cart collection based on its name
    const result = await CartItem.deleteOne({ name: itemName });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Item removed from the cart' });
    } else {
      res.status(404).json({ error: 'Item not found in the cart' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error removing item from the cart' });
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
