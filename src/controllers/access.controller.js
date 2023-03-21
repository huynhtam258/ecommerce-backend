const { CREATED, SuccessResponse } = require('../core/success.response');
const AccessService = require('./../services/access.service');

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    // version 1 
    // new SuccessResponse({
    //   message: 'Get token success',
    //   metadata: await AccessService.handlerResfreshToken(req.body.refreshToken)
    // }).send(res)
    // version 2
    new SuccessResponse({
      message: 'Get token success',
      metadata: await AccessService.handlerResfreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      })
    }).send(res)
  }
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res)
  }

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout success!',
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  }

  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Regiserted OK!',
      metadata: await AccessService.signUp(req.body),
      options: {}
    }).send(res)
  }
}
module.exports = new AccessController()