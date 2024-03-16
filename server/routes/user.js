const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const authMiddleware = require('../configs/authMiddleware').authMiddleware

router.get('/inicio', authMiddleware, userController.viewHome)

router.get('/registrar', userController.viewSignup)

router.post('/registrar', userController.signup)

router.get('/ingresar', userController.viewLogin)

router.post('/ingresar', userController.login)

router.get('/salir', authMiddleware, userController.logout)

module.exports = router
