const articleModel = require('../models/articleModel')
const asyncHandler = require('express-async-handler')

exports.like = asyncHandler(async (req, resp) => {
  const commentId = req.params.id
  const userId = req.cookies.userId

  const article = await articleModel.findOne({ 'comments._id': commentId })
  const comment = article.comments.id(commentId)

  const index = comment.dislikes.indexOf(userId)
  if (index > -1) {
    comment.dislikes.splice(index, 1)
    comment.likes.push(userId)
  } else if (!comment.likes.includes(userId)) {
    comment.likes.push(userId)
  }

  await article.save()
  resp.redirect(`/articulo/${article._id}`)
})

exports.dislike = asyncHandler(async (req, resp) => {
  const commentId = req.params.id
  const userId = req.cookies.userId

  const article = await articleModel.findOne({ 'comments._id': commentId })
  const comment = article.comments.id(commentId)

  const index = comment.likes.indexOf(userId)
  if (index > -1) {
    comment.likes.splice(index, 1)
    comment.dislikes.push(userId)
  } else if (!comment.dislikes.includes(userId)) {
    comment.dislikes.push(userId)
  }

  await article.save()
  resp.redirect(`/articulo/${article._id}`)
})
