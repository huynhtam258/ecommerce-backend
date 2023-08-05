const express = require('express');
const notificationController = require('./../../controllers/notification.controller')
const router = express.Router()
const { asyncHandler } = require('./../../auth/checkAuth');
const { authenticationV2 } = require('./../../auth/authUltils');

router.use(authenticationV2);
router.get('', asyncHandler(notificationController.listNotiByUser));
module.exports = router