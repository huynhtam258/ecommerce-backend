const { SuccessResponse } = require('../core/success.response');
const {
  createComment,
  getCommentsByPrarentId
} = require('./../services/comment.service')

class CommentController {
  createComment = async (req, res, err) => {
    new SuccessResponse({
      message: 'Create new comment',
      metadata: await createComment(req.body)
    }).send(data)
  }

  getCommentsByParentId = async (req, res, err) => {
    new SuccessResponse({
      message: 'Get comment by Parent Id',
      metadata: await getCommentsByPrarentId(req.query)
    }).send(res)
  }
}

module.exports = new CommentController()