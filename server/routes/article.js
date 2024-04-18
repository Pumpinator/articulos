const express = require('express')
const upload = require('../configs/multer')
const router = express.Router()
const articleController = require('../controllers/articleController')

const authMiddleware  = require('../configs/authMiddleware').authMiddleware

router.get('/articulo/crear', authMiddleware, articleController.viewCreate)

router.post('/articulo/crear', authMiddleware, upload.single('image'), articleController.create)

router.get('/articulo/:id', articleController.viewLecture)

router.get('/articulo/actualizar/:id', authMiddleware, articleController.viewUpdate)

router.put('/articulo/actualizar/:id', authMiddleware, upload.single('image'), articleController.update)

router.delete('/articulo/eliminar/:id', authMiddleware, articleController.delete)

router.post('/articulo/buscar', articleController.search)

router.post('/articulo/:id/comentar', authMiddleware, articleController.comment)

router.get('/articulo/:id/like', authMiddleware, articleController.like)

router.get('/articulo/:id/dislike', authMiddleware, articleController.dislike)

module.exports = router
