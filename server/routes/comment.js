const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController')

const authMiddleware = require('../configs/authMiddleware').authMiddleware

router.get('/comentario/:id/like', authMiddleware, commentController.like)

router.get('/comentario/:id/dislike', authMiddleware, commentController.dislike)

module.exports = router
