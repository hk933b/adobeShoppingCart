// ************************************************
// Shopping Cart API
// ************************************************

var shoppingCart = (function() {
  // =============================
  // Private methods and propeties
  // =============================
  cart = [];
  responseObj = [];
  $.ajax({ 
    type: 'GET', 
    url: 'cart.json', 
    dataType: 'json',
    success: function (data) { 
          responseObj = data.items;
          createItemList(data.items);
        }
  });
  // Constructor
  function Item(name, price, count, discount) {
    this.name = name;
    this.price = price;
    this.count = count;
    this.discount = discount
  }
   // Save cart
  function saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
  }
  
    // Load cart
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
  }
  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }
  

  // =============================
  // Public methods and propeties
  // =============================
  var obj = {};
  
  // Add to cart
  obj.addItemToCart = function(name, price, count, discount) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart[item].count ++;
        saveCart();
        return;
      }
    }
    var item = new Item(name, price, count, discount);
    cart.push(item);
    saveCart();
  }
  // Set count from item
  obj.setCountForItem = function(name, count) {
    for(var i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
  };
  // Remove item from cart
  obj.removeItemFromCart = function(name) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart[item].count --;
          if(cart[item].count === 0) {
            cart.splice(item, 1);
          }
          break;
        }
    }
    saveCart();
  }

  // Remove all items from cart
  obj.removeItemFromCartAll = function(name) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  }

  // Clear cart
  obj.clearCart = function() {
    cart = [];
    saveCart();
  }

  // Count cart 
  obj.totalCount = function() {
    var totalCount = 0;
    for(var item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  }

  // Total cart
  obj.totalCart = function() {
    var totalCart = 0;
    for(var item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  }
  obj.totalDiscount = function() {
    var totalDisc = 0;
    for(var item in cart) {
      totalDisc += cart[item].discount * cart[item].discount;
    }
    return Number(totalDisc);
  }
  // List cart
  obj.listCart = function() {
    var cartCopy = [];
    for(i in cart) {
      item = cart[i];
      itemCopy = {};
      for(p in item) {
        itemCopy[p] = item[p];

      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy)
    }
    return cartCopy;
  }
  return obj;
})();


// *****************************************
// Triggers / Events
// ***************************************** 
// Add item
function myFunction(event) {
  event.preventDefault();
  var name = event.target.dataset.name;
  var price = event.target.dataset.price;
  var discount = event.target.dataset.discount;
  var itemAddedObj  = "";
  itemAddedObj += "<div style='display: flex;justify-content: center;'>"
    + "<p style='background-color: #00800063;'>"+name+" is added to cart</p>"
    + "</div>";
  $('.itemAdded').html(itemAddedObj);
  shoppingCart.addItemToCart(name, price, 1, discount);
  displayCart();
}

// Clear items
$('.clear-cart').click(function() {
  shoppingCart.clearCart();
  displayCart();
});

function createItemList(data){
  var listCartItem = "";
  $('#cartList').html('');
  $.each(data, function(i, cartObj) {
    listCartItem += " <div class='rowFlex'>"
    + "<div class='card' style='width: 17rem;'><img class='card-img-top' src=" + cartObj.image + " alt=" + cartObj.name + "/>"
    + "<div class='card-block'>"
    +"<h4 class='card-title'>"+ cartObj.name +"</h4>"
    +"<div><div style='float:left;display:flex;'><p class='card-text' style='text-decoration: red line-through;'>$"+ cartObj.price.display +"</p> &nbsp;&nbsp;<p class='card-text'>$"+ cartObj.price.actual +"</p></div>"
    +"<div style='float:right;width: 40%;height: 30px;background-color: #80808091;text-align: center;padding: 4px 7px 0px 1px;'><a href='#' data-discount="+ cartObj.discount +" data-name="+ JSON.stringify(cartObj.name) +" data-price="+ cartObj.price.display +" class='add-to-cart' onclick='myFunction(event)'>Add to cart</a></div></div>"
    + "</div>"
    +  "</div>";
    +  "</div>";
 });
 $('#cartList').html(listCartItem);
}

function displayCart() {
  var cartArray = shoppingCart.listCart();
  var output = "";
  var header = "";
  var Finaloutput = "";
  var itemAdded = "";
  header += "<tr>"
  + "<th class='headerStyle'>Item</th>"
  + "<th class='headerStyle'>Qauntity</th>"
  + "<th class='headerStyle'>Price</th>"
  +  "</tr>";
  output +=  header;
  for(var i in cartArray) {
    output += "<tr>"
      + "<td>" + cartArray[i].name + "</td>" 
      + "<td><button class='delete-item' data-name=" + JSON.stringify(cartArray[i].name) + ">X</button></td>"
      + "<td><div class='input-group'><button class='minus-item' data-name=" + JSON.stringify(cartArray[i].name) + ">-</button>"
      + "<input type='number' class='item-count form-control' data-name='" + JSON.stringify(cartArray[i].name) + "' value='" + cartArray[i].count + "'>"
      + "<button class='plus-item' data-name=" + JSON.stringify(cartArray[i].name) + ">+</button></div></td>"
      + " = " 
      + "<td>" + cartArray[i].total + "</td>" 
      +  "</tr>";
  }
  if(cartArray.length > 0){
    var totalPriceAfterDiscount = shoppingCart.totalCart() - shoppingCart.totalDiscount();
    itemAdded += "<div>"
    + "<p>Qauntity</p>"
    + "</div>";
    Finaloutput += "<div>"
    + "<div style='display:flex;'><p class='card-text'>Items(" + shoppingCart.totalCount() + ")</p> &nbsp;&nbsp; : &nbsp;&nbsp;<p class='card-text'>$" + shoppingCart.totalCart() + "</p></div>"
    + "<div style='display:flex;'><p class='card-text'>Discount</p> &nbsp;&nbsp; : &nbsp;&nbsp;<p class='card-text'>-$" + shoppingCart.totalDiscount() + "</p></div>" 
    + "<div style='display:flex;'><p class='card-text'>Type of Discount</p> &nbsp;&nbsp; : &nbsp;&nbsp;<p class='card-text'>-$0</p></div>" 
    + "<div style='display:flex;'><p class='card-text'>Order Total</p> &nbsp;&nbsp; : &nbsp;&nbsp;<p class='card-text'>$" + totalPriceAfterDiscount + "</p></div>" 
    + "</div>";
    $('.total-cart').html(Finaloutput);
  }
  else {
    Finaloutput = '';
    $('.total-cart').html(Finaloutput);
  }
 $('.show-cart').html(output);
}

// Delete item button

$('.show-cart').on("click", ".delete-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
})


// -1
$('.show-cart').on("click", ".minus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCart(name);
  displayCart();
})
// +1
$('.show-cart').on("click", ".plus-item", function(event) {
  var name = $(this).data('name')
  shoppingCart.addItemToCart(name);
  displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function(event) {
   var name = $(this).data('name');
   var count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

function searchFun() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  var tempObj = [];
  for (i = 0; i < responseObj.length; i++) {
    var nameObj = responseObj[i].name;
     if (nameObj.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
      tempObj.push(responseObj[i]);
    }
  }
 
  if(tempObj.length > 0){
    createItemList(tempObj);
  }
  else{
    var listCartItem = "";
    $('#cartList').html('');
    listCartItem += "<div style='width:100%;display:flex;justify-content: center;'> No Results found</div>";
 $('#cartList').html(listCartItem);
  }
}
$('#filterByBrand').on("change",function () {
  var selected = $("#filterByBrand option:selected");
  var selectedObj = [];
  selected.each(function () {
      var filterObj = $(this).val();
       for (i = 0; i < responseObj.length; i++) {
        var nameObj = responseObj[i].name;
         if (nameObj.toUpperCase().indexOf(filterObj.toUpperCase()) > -1) {
          selectedObj.push(responseObj[i]);
        }
      }
  });
  if(selectedObj.length > 0){
    createItemList(selectedObj);
  }
  else{
    var listCartItem = "";
    $('#cartList').html('');
    listCartItem += "<div style='width:100%;display:flex;justify-content: center;'> No Results found</div>";
 $('#cartList').html(listCartItem);
  }
});
$('#sortId').on("change",function () {
  var selected = $("#sortId option:selected");
   selected.each(function () {
    var sortBy = $(this).val();
    if(sortBy === 'lowtohigh') {
      responseObj = responseObj.sort((a, b) => a.price.actual - b.price.actual);
    } else{
      responseObj = responseObj.sort((a, b) => b.price.actual - a.price.actual);
    }
    createItemList(responseObj);
  });
});
displayCart();
