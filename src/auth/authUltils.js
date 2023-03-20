const JWT = require('jsonwebtoken');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const asyncHandler = require('../helpers/asyncHandler');
const { findByUserId } = require('../services/keyToken.service');
const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization'
}
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken 
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days'
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days'
    })
    console.log({ accessToken, refreshToken });
    // 

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log('error verify::', err);
      } else {
        console.log('decode verify::', decode);
      }
    })
    return { accessToken, refreshToken }
  } catch (error) {
    console.log(error);
  }
}

const authentication = asyncHandler(async (req, res, next) => {
  /*
      1 - Check userId missing ???
      2 - Get accessToken 
      3 - Verify Token
      4 - check user in dbs?
      5 - check keyStore with this userId?
      6 - Ok all => return next()
  */

  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid Request');

  //2
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keyStore');

  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid Request');

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId');
    req.keyStore = keyStore;
    return next()
  } catch (error) {
    throw error
  }
})

const verifyJWT = async (token, keySecret) => {
  console.log('token', token);
  return await JWT.verify(token, keySecret);
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT
}