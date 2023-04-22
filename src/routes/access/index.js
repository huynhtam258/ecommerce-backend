const express = require('express');
const { asyncHandler } = require('../../auth/checkAuth');
const accessController = require('../../controllers/access.controller');

const { authentication, authenticationV2 } = require('./../../auth/authUltils')
const router = express.Router();

//signUp
router.post('/shop/signup', asyncHandler(accessController.signUp));

/**
 * @swagger
 *   /api/v1/auth/login:
 *     post:
 *       summary: Shop login
 *       tags: [Auth]
 *       security: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         description: Thông tin đăng nhập
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *     responses:
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
router.post('/shop/login', asyncHandler(accessController.login));

// authentication 
router.use(authenticationV2);
// logout
router.post('/shop/logout', asyncHandler(accessController.logout));
// handler refreshToken
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken));

module.exports = router;