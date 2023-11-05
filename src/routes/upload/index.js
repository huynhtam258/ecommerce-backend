const express = require('express');
const uploadController = require('./../../controllers/upload.controller');
const router = express.Router();
const { asyncHandler } = require('./../../auth/authUltils');
const { authenticationV2, uploadDisk } = require('./../../configs/multer.config');

router.post('/product', asyncHandler(uploadController.uploadFile));
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb))

module.exports = router