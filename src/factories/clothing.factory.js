const { clothing } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const { Product } = require('./product.factory')
const { updateProductById } = require("../repositories/product.repo");
const { removeAttrUndefined, updateNestedObjectParser } = require("../utils");

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes)
    if (!newClothing) {
      throw new BadRequestError('create new Clothing error')
    }

    const newProduct = await super.createProduct()
    if (!newProduct) {
      throw new BadRequestError('create new Clothing error')
    }
    return newProduct
  }

  async updateProduct(product_id) {
    // 1. remove attr has null undefined
    const objectParams = removeAttrUndefined(this);

    // 2. check update where?
    if (objectParams.product_attributes) {
      // update child
      await updateProductById(
        {
          productId: product_id,
          bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
          model: clothing
        })
    }

    return await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
  }
}

module.exports = {
  Clothing
}