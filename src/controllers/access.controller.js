const { CREATED, SuccessResponse } = require('../core/success.response');
const AccessService = require('./../services/access.service');

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get token success',
      metadata: await AccessService.handlerResfreshToken(req.body.refreshToken)
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