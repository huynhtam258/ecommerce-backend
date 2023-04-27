const express = require('express');
const { asyncHandler } = require('./../../auth/checkAuth');
const productController = require('../../controllers/product.controller');

const { authenticationV2 } = require('./../../auth/authUltils');
const router = express.Router();

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))

// authentication
router.use(authenticationV2);

// 
router.post('', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.put('/published/:id', asyncHandler(productController.publishProductByShop))
router.put('/unpublished/:id', asyncHandler(productController.unPublishProductByShop))

// query
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))
module.exports = router