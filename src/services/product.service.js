const { BadRequestError } = require("../core/error.response");
const { 
  findAllDarftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct
} = require("../models/repositories/product.repo");

class ProductService {
  static productRegistry = {}

  static registerProductType(type, classRef) {
    ProductService.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {
    const productClass = ProductService.productRegistry[type];
    if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductService.productRegistry[type];

    if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

    return new productClass(payload).updateProduct(productId)
  }

  // PUT
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id })
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id })
  }
  // END PUT

  // QUERY
  static async findAllDarftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true }
    return await findAllDarftForShop({ query, limit, skip })
  }

  static async findAllPublishsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true }
    return await findAllPublishForShop({ query, limit, skip })
  }

  static async searchProducts({ keySearch }) {
    return await searchProductsByUser({ keySearch })
  }

  static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
    return await findAllProducts({ limit, sort, filter, page, select: ['product_name', 'product_price', 'product_thumb'] })
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v', 'product_variations'] })
  }
}

module.exports = {
  ProductService,
}