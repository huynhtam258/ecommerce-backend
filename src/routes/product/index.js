const express = require('express');
const { asyncHandler } = require('./../../auth/checkAuth');
const productController = require('../../controllers/product.controller');

const { authenticationV2 } = require('./../../auth/authUltils');
const router = express.Router();

/**
 * @swagger
 *   /api/v1/product/search/{keySearch}:
 *     get:
 *       summary: Search product by key
 *       tags: [Products]
 *       security: []
 *       parameters:
 *         - in: path
 *           name: keySearch
 *           schema:
 *             type: string
 *           required: true
 *           description: key word search product
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: List product contains key search
 *           contents:
 *             application/json
 */
router.get('/search/:keySearch', productController.getListSearchProduct)
/**
 * @swagger
 *   /api/v1/product/:
 *     get:
 *       summary: Search product by key
 *       tags: [Products]
 *       security: []
 *       parameters:
 *         - in: path
 *           name: keySearch
 *           schema:
 *             type: string
 *           required: true
 *           description: key word search product
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: List product contains key search
 *           contents:
 *             application/json
 */
router.get('/', productController.findAllProducts)
/**
 * @swagger
 *   /api/v1/product/{product_id}:
 *     get:
 *       summary: Search one product by product_id
 *       tags: [Products]
 *       security: []
 *       parameters:
 *         - in: path
 *           name: keySearch
 *           schema:
 *             type: string
 *           required: true
 *           description: key word search product
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: List product contains key search
 *           contents:
 *             application/json
 */
router.get('/:product_id', productController.findProduct)

// authentication
router.use(authenticationV2);

/**
 * @swagger
 *   /api/v1/product:
 *     post:
 *       summary: Create product
 *       tags: [Products]
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Product info
 *           contents:
 *             application/json
 */
router.post('', asyncHandler(productController.createProduct))

/**
 * @swagger
 *   /api/v1/product/{productId}:
 *     patch:
 *       summary: Update product
 *       tags: [Products]
 *       parameters:
 *         - in: path
 *           name: productId
 *           schema:
 *             type: string
 *           required: true
 *           description: productId value
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Product info
 *           contents:
 *             application/json
 */
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('/published/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublished/:id', asyncHandler(productController.unPublishProductByShop))

// query
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))
module.exports = router