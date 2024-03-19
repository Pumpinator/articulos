const articleModel = require('../models/articleModel')
const asyncHandler = require('express-async-handler')

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
  try {
    await articleModel.create({
      title: title,
      body: body,
      author: userId,
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

  let reaction = 'none'
  if (data.likes.includes(userId)) {
    reaction = 'like'
  } else if(data.dislikes.includes(userId)) {
    reaction = 'dislike'
  }
  locals.reaction = reaction
  locals.userId = userId

  locals.commented = data.comments.some(comment => comment.author._id.toString() === userId);

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
  const data = await articleModel.findByIdAndUpdate(id, {
    title: title,
    body: body,
    updated_at: Date.now(),
  })
  if (data.author != req.cookies.userId)
    return resp.status(401).render('partials/error', {
      error: { code: 401, message: 'No autorizado.' },
    })
  resp.redirect(`/articulo/actualizar/${id}`)
})

exports.delete = asyncHandler(async (req, resp) => {
  const id = req.params.id
  const userId = req.cookies.userId

  const article = await articleModel.findById(id)

  if (article.author.toString() !== userId)
    return resp
      .status(403)
      .send('No tienes permiso para eliminar este artículo')

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
