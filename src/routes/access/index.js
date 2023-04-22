const express = require('express');
const { asyncHandler } = require('../../auth/checkAuth');
const accessController = require('../../controllers/access.controller');

const { authentication, authenticationV2 } = require('./../../auth/authUltils')
const router = express.Router();

/**
 * @swagger
 *   /v1/api/shop/signUp:
 *     post:
 *       summary: Shop Register
 *       tags: [Auth]
 *       security: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Login Shop
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *               format: email
 *             password:
 *               type: string
 *       - in: header
 *         name: x-api-key
 *         type: string
 *     responses:
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Register Success
 *           contents:
 *             application/json
 */
router.post('/shop/signup', asyncHandler(accessController.signUp));
/**
 * @swagger
 * 
 * /v1/api/shop/login:
 *   post:
 *     summary: Login to the system
 *     description: Login with email and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *                 example: kakashi_shop04@gmail.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: 123456789
 *     responses:
 *       '200':
 *         description: Login successful
 *       '400':
 *         description: Invalid request
 *       '401':
 *         description: Unauthorized
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: x-api-key
 *         in: header
 *         required: true
 *         description: API key for authentication
 *         type: string
 */
 
router.post('/shop/login', asyncHandler(accessController.login));

// authentication 
router.use(authenticationV2);
// logout
router.post('/shop/logout', asyncHandler(accessController.logout));
// handler refreshToken
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken));

module.exports = router;