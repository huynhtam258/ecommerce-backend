const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require('./discount.service')
class CheckoutService {
  static async checkoutReview({
    cardId, userId, shop_order_ids
  }) {
    // check cardId exist
    const foundCart = await findCartById(cardId);
    if (!foundCart) throw new BadRequestError('Cart does not exists!');

    const checkout_order = {
      totalPrice: 0, // tong tien hang
      feeShip: 0, // phi van chuyen
      totalDiscount: 0, // tong tien discount giam gia
      totalCheckout: 0 // tong thanh toan
    }

    const shop_order_ids_new = []

    // tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      //check product avaiable
      const { shopId, shop_discounts = [], item_products = []} = shop_order_ids[i];
      // checkout product available
      const checkProductServer = await checkoutProductServer(item_products)
      console.log('checkProductServer::', checkProductServer);
      if(!checkProductServer[0]) throw new BadRequestError('order wrong!!!')

      // tong tien don hang
      const checkoutPrice = checkProductByServer.reduce((acc, product) => {
        return acc + (product.quantity + product.price)
      }, 0)

      // tong tien truoc khi xu ly
      checkout_order.totalPrice =+ checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer
      }

      // neu shop_discounts ton tai > 0, check xem co hop le hay khong
      if(shop_discounts.length > 0) {
        // gia su chi co 1 discount
        //get amount discount
        const { totalPrice = 0, discount = 0} = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer
        })
        // tong cong discount giam gia
        checkout_order.totalCheckout += discount
        // neu tien giam gia lon hon 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)

    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }
}

module.exports = CheckoutService