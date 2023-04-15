const { SuccessResponse } = require('../core/success.response');
// const ProductService = require('./../services/product.service');
const ProductServiceV2 = require('./../services/product.service.highlevel');
class ProductController {
  // createProduct = async (req, res, next) => {
  //   new SuccessResponse({
  //     message: "Get token success",
  //     metadata: await ProductService.createProduct(req.body.product_type, {
  //       ...req.body,
  //       product_shop: req.user.userId
  //     })
  //   }).send(res)
  // }
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Product success!",
      metadata: await ProductServiceV2.createProduct(
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
      metadata: await ProductServiceV2.updateProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish Product success",
      metadata: await ProductServiceV2.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublish Product success",
      metadata: await ProductServiceV2.unPublishProductByShop({
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
      metadata: await ProductServiceV2.findAllDarftsForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Draft success",
      metadata: await ProductServiceV2.findAllPublishsForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list search success",
      metadata: await ProductServiceV2.searchProducts(req.params)
    }).send(res)
  }

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list findAllProducts success',
      metadata: await ProductServiceV2.findAllProducts(req.query)
    }).send(res)
  }

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get findProduct Success',
      metadata: await ProductServiceV2.findProduct({
        product_id: req.params.product_id
      })
    }).send(res)
  }
}

module.exports = new ProductController()