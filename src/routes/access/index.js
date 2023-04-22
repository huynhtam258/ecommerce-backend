const express = require('express');
const { asyncHandler } = require('../../auth/checkAuth');
const accessController = require('../../controllers/access.controller');

const { authentication, authenticationV2 } = require('./../../auth/authUltils')
const router = express.Router();

/**
 * @swagger
 * 
 * /v1/api/shop/signup:
 *   post:
 *     summary: Sign Up to the system
 *     description: Sign Up with email and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Shop Name
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
/**
 * @swagger
 * /v1/api/shop/logout:
 *   post:
 *     summary: Logout to the system
 *     description: Login with email and password
 *     tags:
 *       - Auth
 *     responses:
 *       '200':
 *         description: Login successful
 *       '400':
 *         description: Invalid request
 *       '401':
 *         description: Unauthorized
 *     security:
 *     parameters:
 *       - name: x-api-key
 *         in: header
 *         required: true
 *         description: API key for authentication
 *         type: string
 *       - name: Authentication
 *         in: header
 *         required: true
 *         description: Token for authentication
 *         type: string
 *       - name: x-client-id
 *         in: header
 *         required: true
 *         description: shopId for authentication
 *         type: string
 */
router.post('/shop/logout', asyncHandler(accessController.logout));
/**
 * @swagger
 * /v1/api/shop/handlerRefreshToken:
 *   post:
 *     summary: handlerRefreshToken to the system
 *     description: Login with email and password
 *     tags:
 *       - Auth
 *     responses:
 *       '200':
 *         description: Login successful
 *       '400':
 *         description: Invalid request
 *       '401':
 *         description: Unauthorized
 *     security:
 *     parameters:
 *       - name: x-api-key
 *         in: header
 *         required: true
 *         description: API key for authentication
 *         type: string
 *       - name: Authentication
 *         in: header
 *         required: true
 *         description: Token for authentication
 *         type: string
 *       - name: x-client-id
 *         in: header
 *         required: true
 *         description: shopId for authentication
 *         type: string
 */
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken));

module.exports = router;