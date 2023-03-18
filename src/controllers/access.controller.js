const { CREATED, SuccessResponse } = require('../core/success.response');
const AccessService = require('./../services/access.service');

class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
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