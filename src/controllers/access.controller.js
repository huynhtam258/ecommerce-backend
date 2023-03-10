const { CREATED } = require('../core/success.response');
const AccessService = require('./../services/access.service');

class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Regiserted OK!',
      metadata: await AccessService.signUp(req.body),
      options: {}
    }).send(res)
  }
}
module.exports = new AccessController()