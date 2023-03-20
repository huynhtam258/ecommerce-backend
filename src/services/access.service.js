const shopModel = require("./../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUltils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, ForbiddenError } = require('./../core/error.response');

// service ///
const { findByEmail } = require("./shop.service");
const RoleShop = {
  SHOP: 'SHOP',
  WRITE: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}
class AccessService {
  /*
    check this token used
  */
  static handlerResfreshToken = async (refreshToken) => {
    // check this token used
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    // if this token used 
    if (foundToken) {
      // decode check is who
      const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
      console.log({ userId, email })

      // delete all tokens in keyToken
      await KeyTokenService.deleteKeyById(userId);

      throw new ForbiddenError('Something wrong happend !! Please relogin');
    }

    // if this token is not used
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError('Shop not registed 1');

    // verifyToken
    const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey);
    // check userId
    const foundShop = await findByEmail({email});
    if (!foundShop) throw new AuthFailureError('Shop not registed 2');

    // create new tokens
    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey);

    // update token
    await holderToken.update({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })

    return {
      user: { userId, email },
      tokens
    }
  }

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey
  }

  /*
    1 - check email in dbs
    2 - match password
    3 - create Access Token and RefreshToken and save
    4 - generate tokens
    5 - get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError('Shop not registered');

    // 2
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError('Authentication error');
    //3
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');
    // 4
    const { _id: userId } = foundShop
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId
    });

    // 5
    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
      tokens
    };
  }

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('Error Shop already registed')
    }
    const passwordHash = await bcrypt.hash(password, 10)

    const newShop = await shopModel.create({
      name, email, password: passwordHash, roles: [RoleShop.SHOP]
    })
    if (newShop) {

      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');
      console.log({ privateKey, publicKey });

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey
      });

      if (!keyStore) {
        throw new BadRequestError('keyStore error')
      }
      // created token pair
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
      console.log('Created Token Success::', tokens);

      return {
        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
        tokens
      }
    }
  }
}

module.exports = AccessService