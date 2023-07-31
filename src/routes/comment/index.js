const express = require('express');
const commentController = require('./../../controllers/comment.controller');
const router = express.Router()
const { asyncHandler } = require('./../../auth/checkAuth');
const { authenticationV2 } = require('./../../auth/authUltils');

router.use(authenticationV2);

router.post('', asyncHandler(commentController.createComment));
router.get('', asyncHandler(commentController.getCommentsByParentId));

module.exports = router