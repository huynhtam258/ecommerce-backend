const express = require('express');
const discountController = require('../../controllers/discount.controller');
const router = express.Router()
const { asyncHandler } = require('./../../auth/checkAuth');
const { authenticationV2 } = require('./../../auth/authUltils')
// get amount a discount 
router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodeWithProducts));

// authentication
router.use(authenticationV2)

router.post('', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCodes));

module.exports = router;