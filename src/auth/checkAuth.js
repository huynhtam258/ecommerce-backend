const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}
const URL_WHITELIST = [
  "/api-docs/",
  "/healthcheck/"
]
const { findById } = require('./../services/apiKey.service');
const apiKey = async (req, res, next) => {
  try {
    if (ignoreWhiteList(req)) return next()

    const key = req.headers[HEADER.API_KEY]
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    // check objKey

    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    req.objKey = objKey
    return next()
  } catch (error) {
    console.log(error)
  }
}
const ignoreWhiteList = (request) => {
  if (request && request.url) {
    if (URL_WHITELIST.includes(request.url)) {
      return true;
    }
  }

  return false;
}
const permission = (permission) => {
  return (req, res, next) => {
    if (ignoreWhiteList(req)) return next()

    console.log(req.objKey.permissions);
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'Permission Denied'
      })
    }

    console.log('Permision:: ', permission);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: 'Permission Denied'
      })
    }

    return next()
  }
}

const asyncHandler = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

module.exports = {
  apiKey,
  permission,
  asyncHandler
}