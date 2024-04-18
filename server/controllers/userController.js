const userModel = require('../models/userModel')
const articleModel = require('../models/articleModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

const isLogged = require('../configs/authMiddleware').isLogged
const JWT_SECRET = process.env.JWT_SECRET || 'Quetzalcode'

exports.viewHome = asyncHandler(async (req, resp) => {
  const locals = {
    title: 'Inicio | Articulos UTL',
    description: 'Hecho por Quetzalcode.',
    header: 'Inicio',
    isLogged: isLogged(req),
  }
  const userId = req.cookies.userId
  const data = await articleModel
    .find({ author: userId })
    .sort({ created_at: -1 })
  resp.render('user/articles', {
    locals,
    data,
  })
})

exports.viewSignup = asyncHandler(async (req, resp) => {
  if (isLogged(req)) return resp.redirect('/inicio')
  const locals = {
    title: 'Registro | Articulos UTL',
    description: 'Hecho por Quetzalcode.',
    header: 'Registro',
    isLogged: isLogged(req),
  }
  resp.render('user/signup', { locals })
})

exports.signup = asyncHandler(async (req, resp) => {
  const { username, password } = req.body
  const encodedPassword = await bcrypt.hash(password, 10)
  try {
    const user = await userModel.create({
      username: username,
      password: encodedPassword,
    })
    resp.status(201).redirect('/ingresar')
  } catch (error) {
    if (error.code === 11000)
      resp.status(409).render('partials/error', {
        error: { code: 409, message: 'El nombre de usuario ya está en uso.' },
      })
  }
})

exports.viewLogin = asyncHandler(async (req, resp) => {
  if (isLogged(req)) return resp.redirect('/inicio')
  const locals = {
    title: 'Ingreso | Articulos UTL',
    description: 'Hecho por Quetzalcode.',
    header: 'Ingreso',
    isLogged: isLogged(req),
  }
  resp.render('user/login', { locals })
})

exports.login = asyncHandler(async (req, resp) => {
  const { username, password } = req.body
  const user = await userModel.findOne({ username })
  if (user === null) {
    resp.status(401).render('partials/error', {
      error: { code: 401, message: 'Credenciales incorrectas.' },
    })
  }
  const validPassword = await bcrypt.compare(password, user.password)
  if (!user || !validPassword)
    resp.status(401).render('partials/error', {
      error: { code: 401, message: 'Credenciales incorrectas.' },
    })
  const token = jsonwebtoken.sign({ userId: user._id }, JWT_SECRET)
  resp.cookie('userId', user._id, { httpOnly: true })
  resp.cookie('token', token, { httpOnly: true })
  resp.redirect('/inicio')
})

exports.logout = asyncHandler(async (req, resp) => {
  resp.clearCookie('token')
  resp.clearCookie('userId')
  resp.redirect('/')
})
