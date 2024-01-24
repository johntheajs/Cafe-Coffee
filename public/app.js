var app = angular.module('myApp', []);


app.service('DataService', function() {
  var cartItems = [
    { name: 'Americano', quantity: 2, price: 20 },
    { name: 'Latte', quantity: 1, price: 25 },
  ];

  return {
    getSharedData: function() {
      // Return a copy of cartItems to avoid direct binding
      return angular.copy(cartItems);
    },
    setSharedData: function(newCartItems) {
      // Update the cartItems with the new data
      cartItems = angular.copy(newCartItems);
      console.log(cartItems);
    }
  };
});





app.controller('ProductController', function($scope, DataService, $http) {

  $scope.cartItems = DataService.getSharedData();

  $scope.products = [
      { 
          name: 'Americano', 
          image: 'image/americano.jpg', 
          stars: 5, 
          price: '20' 
      },
      {
          name: 'Latte', 
          image: 'image/latte.jpg', 
          stars: 5, 
          price: '25' 
      },
      {
          name: 'Espresso', 
          image: 'image/espresso.jpg', 
          stars: 4, 
          price: '15' 
      },
      {
          name: 'Coffee', 
          image: 'image/coffee.jpg', 
          stars: 4, 
          price: '30' 
      },
      {
          name: 'Green-Tea', 
          image: 'image/green-tea.jpg', 
          stars: 4, 
          price: '35' 
      },
      {
          name: 'Black-Coffee', 
          image: 'image/black-coffee.webp', 
          stars: 5, 
          price: '15' 
      },
      {
          name: 'Chocolate-Shake', 
          image: 'image/chocolate-shake.avif', 
          stars: 4, 
          price: '40' 
      },
      {
          name: 'Iced-Tea', 
          image: 'image/iced-tea.cms', 
          stars: 3, 
          price: '35' 
      }

      
      
  ];

  $scope.addToCart = function(item) {
    var tempItem = {
      name: item.name,
      quantity: 1, // Initial quantity when adding to the cart
      price: item.price
    };

    // Send a POST request to add the item to the cart in the database
    $http.post('/add-to-cart', tempItem)
      .then(function(response) {
        // Item added to the cart in the database, you can handle the response here
        console.log('Item added to the cart:', response.data);

        // Update cart items in the service
        $scope.cartItems.push(tempItem);

        // Calculate and update the total price
        $scope.calculateTotalPrice();

        // Update cart items in the service
        DataService.setSharedData($scope.cartItems);
      })
      .catch(function(error) {
        // Handle any errors that may occur when adding the item to the cart
        console.error('Error adding item to cart:', error);
      });
  };

$scope.calculateTotalPrice = function() {
  $scope.cartTotalPrice = $scope.cartItems.reduce(function(total, item) {
    return total + item.price * item.quantity;
  }, 0);
};

  $scope.searchText = '';
  $scope.selectedSortOption = 'name'; 

  $scope.updateCartItems = function(newValue) {
    DataService.setSharedData(newValue); // Set the shared data
  };

 
});







app.controller('CartController', function($scope, DataService, $http) {

  

  // Initialize cart items and total
  $scope.cartItems = [];
  $scope.cartTotalPrice = 0;
  $scope.cartItems = DataService.getSharedData();
  // Call getCartItems when the controller is initialized
  

  $http.get('/get-cart-items')
    .then(function(response) {
      // Update the cartItems array with the retrieved data
      $scope.cartItems = response.data;
      
      // Calculate the total price of items in the cart
      $scope.calculateTotalPrice();
    })
    .catch(function(error) {
      console.error('Error fetching cart items:', error);
    });

    // Update the cartItems array and send a request to remove the item from the server
    $scope.removeItem = function(item) {
      // Check if the item is already in the cart
      var existingItem = $scope.cartItems.find(function(cartItem) {
        return cartItem.name === item.name;
      });
    
      if (existingItem) {
        if (existingItem.quantity > 1) {
          // If the item quantity is greater than 1, decrease the quantity
          existingItem.quantity -= 1;
        } else {
          // If the item quantity is 1 or less, remove the item from the cart
          var index = $scope.cartItems.indexOf(existingItem);
          if (index !== -1) {
            $scope.cartItems.splice(index, 1);
          }
        }
    
        // Calculate and update the total price
        $scope.calculateTotalPrice();
    
        // Update cart items in the service
        DataService.setSharedData($scope.cartItems);
    
        // Now, send a request to remove the item from the server by name
        $http.delete('/delete-cart-item/' + item.name)
          .then(function(response) {
            // Handle the response, if needed
          })
          .catch(function(error) {
            console.error('Error deleting cart item in AngularJS:', error);
          });
      }
    };
    
    
    
    
    


    

  

   // Function to place an order
   $scope.placeOrder = function() {
    // Send the order details to the server (Node.js) for storage
    var orderData = {
      items: $scope.cartItems,
      totalPrice: $scope.cartTotalPrice
    };

    // Use $http to send a POST request to your Node.js server
    $http.post('/api/placeOrder', orderData)
      .then(function(response) {
        // Order placed successfully, you can handle the response here
        console.log('Order placed successfully:', response.data);

        // Clear the cart after placing the order
        $scope.cartItems = [];
        $scope.cartTotalPrice = 0;

        // Redirect to the confirmation page (you may implement this part)
        // Example: $location.path('/confirmation');
      })
      .catch(function(error) {
        // Handle any errors that may occur during order placement
        console.error('Error placing order:', error);
      });
  };


  // Calculate the total price of items in the cart
  $scope.calculateTotalPrice = function() {
    $scope.cartTotalPrice = $scope.cartItems.reduce(function(total, item) {
      return total + item.price * item.quantity;
    }, 0);
  };

  
  
  

 
   

  
});

app.controller('ConfirmationController', function($scope, $http) {
  // Fetch order details from your server (you should implement this)
  // For this example, we'll use a dummy order object
  $scope.order = {
    items: [
      { name: 'Americano', quantity: 2, price: 20 },
      { name: 'Latte', quantity: 1, price: 25 },
    ],
    totalPrice: 65,
  };

  $scope.fetchOrderDetails = function() {
    // Make an HTTP GET request to your server endpoint
    $http.get('/api/getOrderDetails')
      .then(function(response) {
        // Update the order object with the fetched data
        $scope.order = response.data;
      })
      .catch(function(error) {
        // Handle any errors that may occur during the request
        console.error('Error fetching order details:', error);
      });
  };

  // Fetch order details when the controller is loaded
  $scope.fetchOrderDetails();

});
