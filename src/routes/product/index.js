const express = require('express');
const { asyncHandler } = require('./../../auth/checkAuth');
const productController = require('../../controllers/product.controller');

const { authenticationV2 } = require('./../../auth/authUltils');
const router = express.Router();

router.post('', productController.createProduct)
module.exports = router