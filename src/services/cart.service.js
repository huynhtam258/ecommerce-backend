/*
    Key feature: cart service
    - add product to cart [User]
    - reduce product to cart [User]
    - increase quantity by one [User]
    - get cart [User]
    - Delete cart [User]
    - Delete cart item [User]
*/

const { cart } = require("../models/cart.model");

class CartService {
  // START REPO CART
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' };
    const updateOrInsert = {
      $addToSet: {
        cart_product: product
      }
    }
    const options = {
      upsert: true, new: true
    }

    return await cart.findOneAndUpdate(query, updateOrInsert, options)
  }
  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product
    const query = {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'acitve'
    }
    const updateSet = {
      $inc: { // check product had exist in array, if It had exist, $ will be update quatity product
        'cart_products.$.quantity': quantity
      }
    }
    const options = { upsert: true, new: true }

    return await cart.findOneAndUpdate(query, updateSet, options);
  }
  // END REPO CART
  static async addToCart({ userId, product = {} }) {
    // check cart 
    const userCart = await cart.findOne({
      cart_userId: userId
    })

    if (!userCart) {
      //create cart for user
      return await CartService.createUserCart({ userId, product })
    }

    // if cart is exist but it is empty
    if (!userCart.cart_count_product.length) {
      userCart.cart_products = [product]
      return await userCart.save()
    }

    // if cart is exist and has product
    return await CartService.updateUserCartQuantity({ userId, product })
  }
}