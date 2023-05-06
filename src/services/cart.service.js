/*
    Key feature: cart service
    - add product to cart [User]
    - reduce product to cart [User]
    - increase quantity by one [User]
    - get cart [User]
    - Delete cart [User]
    - Delete cart item [User]
*/

const { NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

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

  // update cart
  /*
    shop_order_ids: [
      {
        shopId,
        item_products: [
          quantity,
          price,
          shopId,
          old_quantity,
          productId
        ],
        versions
      }
    ]
   */
  static async addToCartV2({ userId, shop_order_ids = []}) {
    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];
    // check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError('')
    
    // compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError('Product do not belong to the shop')
    }

    if (quantity === 0) {
      // deleted
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity
      }
    })
  }

  static async deleteItemInCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' }
    const updateSet = {
      $pull: {
        cart_products: {
          productId
        }
      }
    }

    const deleteCart = await cart.updateOne(query, updateSet)
    return deleteCart
  }

  static async getListUserCart({userId}) {
    return await cart.findOne({
      cart_userId: +userId
    }).lean()
  }
}

module.exports = CartService