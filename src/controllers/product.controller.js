const { SuccessResponse } = require('../core/success.response');
// const ProductService = require('./../services/product.service');
const { ProductService } = require('./../services/product.service');
class ProductController {

  // create product
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Product success!",
      metadata: await ProductService.createProduct(
        req.body.product_type,
        {
          ...req.body,
          product_shop: req.user.userId
        })
    }).send(res)
  }

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Product Success',
      metadata: await ProductService.updateProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish Product success",
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublish Product success",
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  // QUERY

  /**
   * @desc Get all Drafts for shop
   * @param {Number} limit 
   * @param {Number} skip 
   * @param {JSON}  
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Draft success",
      metadata: await ProductService.findAllDarftsForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Draft success",
      metadata: await ProductService.findAllPublishsForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list search success",
      metadata: await ProductService.searchProducts(req.params)
    }).send(res)
  }

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list findAllProducts success',
      metadata: await ProductService.findAllProducts(req.query)
    }).send(res)
  }

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get findProduct Success',
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id
      })
    }).send(res)
  }
}

module.exports = new ProductController()