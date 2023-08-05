const { SuccessResponse } = require('../core/success.response');
const {
  createComment,
  getCommentsByPrarentId,
  deleteComment
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

  deleteComment = async (req, res, err) => {
    new SuccessResponse({
      message: 'Delete comment Success',
      metadata: await deleteComment(req.body)
    })
  }
}

module.exports = new CommentController()