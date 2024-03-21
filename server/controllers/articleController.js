const articleModel = require('../models/articleModel')
const asyncHandler = require('express-async-handler')
const fs = require('fs');

const isLogged = require('../configs/authMiddleware').isLogged

exports.viewCreate = asyncHandler(async (req, resp) => {
  const locals = {
    title: 'Crear | Articulos UTL',
    description: 'Hecho por Quetzalcode.',
    header: 'Nuevo artículo',
    isLogged: isLogged(req),
  }
  resp.render('article/create', { locals })
})

exports.create = asyncHandler(async (req, resp) => {
  const { title, body } = req.body
  const userId = req.cookies.userId
  const file = req.file
  try {
    await articleModel.create({
      title: title,
      body: body,
      author: userId,
      image: file.path === undefined ? '' : file.path,
    })
    resp.redirect('/inicio')
  } catch (error) {
    resp.status(500).render('partials/error', {
      error: { code: 500, message: 'Error interno del servidor.' },
    })
  }
})

exports.viewLecture = asyncHandler(async (req, resp) => {
  const locals = {
    title: 'Articulo | Articulos UTL',
    description: 'Hecho por Quetzalcode.',
    header: 'Articulo',
    isLogged: isLogged(req),
  }

  const id = req.params.id
  const userId = req.cookies.userId
  const data = await articleModel
    .findById({ _id: id })
    .populate({
      path: 'author',
      select: 'username',
    })
    .populate({
      path: 'comments.author',
      select: 'username',
    })

  locals.userId = userId

  resp.render('article/lecture', { locals, data })
})

exports.viewUpdate = asyncHandler(async (req, resp) => {
  const locals = {
    title: 'Editar | Articulos UTL',
    description: 'Hecho por Quetzalcode.',
    header: 'Editar artículo',
    isLogged: isLogged(req),
  }

  const id = req.params.id
  const data = await articleModel.findById({ _id: id })

  if (data.author != req.cookies.userId)
    return resp.status(401).render('partials/error', {
      error: { code: 401, message: 'No autorizado.' },
    })

  resp.render('article/update', {
    locals,
    data,
  })
})

exports.update = asyncHandler(async (req, resp) => {
  const { title, body } = req.body
  const id = req.params.id
  const file = req.file

  const article = await articleModel.findById(id)

  if (article.author.toString() !== req.cookies.userId) {
    return resp.status(401).render('partials/error', {
      error: { code: 401, message: 'No autorizado.' },
    })
  }

  if (article.image) fs.unlinkSync(article.image);

  const data = await articleModel.findByIdAndUpdate(id, {
    title: title,
    body: body,
    image: file.path ? file.path : '',
    updated_at: Date.now(),
  }, { new: true })

  resp.redirect(`/articulo/${id}`)
})

exports.delete = asyncHandler(async (req, resp) => {
  const id = req.params.id
  const userId = req.cookies.userId

  const article = await articleModel.findById(id)

  if (article.author.toString() !== userId)
    return resp
      .status(403)
      .send('No tienes permiso para eliminar este artículo')

  if (article.image) fs.unlinkSync(article.image);

  await articleModel.findByIdAndDelete(id)

  resp.redirect('/inicio')
})

exports.search = asyncHandler(async (req, resp) => {
  const locals = {
    title: 'Buscar | Articulos UTL',
    description: 'Hecho por Quetzalcode.',
    header: 'Resultados de búsqueda',
    isLogged: isLogged(req),
  }

  const searchTerm = req.body.searchTerm
  const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '')

  const data = await articleModel.find({
    $or: [
      { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
      { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
    ],
  })

  resp.render('article/search', { data, locals })
})

exports.comment = asyncHandler(async (req, resp) => {
  const articleId = req.params.id
  const body = req.body.body
  const userId = req.cookies.userId
  const data = await articleModel.findByIdAndUpdate(articleId, {
    $push: {
      comments: {
        author: userId,
        body: body,
      },
    },
  })
  resp.redirect(`/articulo/${articleId}`)
})

exports.like = asyncHandler(async (req, resp) => {
  const articleId = req.params.id
  const userId = req.cookies.userId

  const article = await articleModel.findById(articleId)
  const index = article.dislikes.indexOf(userId)

  if (index > -1) {
    article.dislikes.splice(index, 1)
    article.likes.push(userId)
  } else if (!article.likes.includes(userId)) {
    article.likes.push(userId)
  }

  await article.save()
  resp.redirect(`/articulo/${articleId}`)
})

exports.dislike = asyncHandler(async (req, resp) => {
  const articleId = req.params.id
  const userId = req.cookies.userId

  const article = await articleModel.findById(articleId)
  const index = article.likes.indexOf(userId)

  if (index > -1) {
    article.likes.splice(index, 1)
    article.dislikes.push(userId)
  } else if (!article.dislikes.includes(userId)) {
    article.dislikes.push(userId)
  }

  await article.save()
  resp.redirect(`/articulo/${articleId}`)
})
