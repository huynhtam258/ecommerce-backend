const { BadRequestError, NotFoundError } = require("../core/error.response");
const { convertToObjectIdMongodb } = require("../utils");
const { findAllProducts } = require('./../models/repositories/product.repo');
const discount = require('./../models/discount.model');
const { findAllDiscountCodeUnSelect, findAllDiscountCodeSelect, updateDiscountCodeById, checkDiscountExists } = require("../models/repositories/discount.repo");
class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user
    } = payload;

    // check date
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Discount code has expried');
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before end date')
    }

    // create index for discount code
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId)
    }).lean()

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount exists!')
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(discount_end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_shopId: convertToObjectIdMongodb(shopId),
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    });

    return newDiscount
  }

  static async updateDiscountCode(discountId, bodyUpdate) {
    return await updateDiscountCodeById(discountId, bodyUpdate)
  }

  // Get all discount codes available with products
  static async getAllDiscountCodesWithProduct({
    code, shopId, userId, limit, page
  }) {
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId)
    }).lean()

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('discount not exists')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products
    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: {
            $in: discount_product_ids,
          },
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    return products
  }

  // get all discount code of shop

  static async getAllDiscountCodeByShop({
    limit, page, shopId
  }) {
    const discounts = await findAllDiscountCodeUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true
      },
      unSelect: ['__v', 'discount_shopId'],
      model: discount
    })

    return discounts
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })

    if (!foundDiscount) throw new NotFoundError('Discount does not exist')

    const { discount_is_active, discout_max_uses, discount_min_order_value, discount_users_used } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError('discount expried')
    if (!discout_max_uses) throw new NotFoundError('discount are out')

    if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
      throw new NotFoundError('discount ecode has expried')
    }

    // check maximum value
    let totalOrder = 0
    if (discount_min_order_value > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(`discount requires a minimum order value of ${discount_min_order_value}!`)
      }
    }

    if(discount_max_uses_per_user > 0) {
      const userUserDiscount = discount_users_used.find(user => user.userId === userId)
      if( userUserDiscount) {
        // TODO
      }
    }

    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      tottalPrice: totalOrder - amount
    }
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    // TODO
    return {}
  }

  static async cancelDiscountCode({codeId, shopId, userId}) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })

    if(!foundDiscount) throw new NotFoundError('discount does not exist')

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull:  {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    })

    return result
  }
}


module.exports = DiscountService