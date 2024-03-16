const articleModel = require('../models/articleModel')
const asyncHandler = require('express-async-handler')

const isLogged = require('../configs/authMiddleware').isLogged

exports.viewLatest = asyncHandler(async (req, resp) => {
  const locals = {
    title: 'Articulos UTL',
    description: 'Hecho por Quetzalcode.',
    header: 'Últimos artículos',
    isLogged: isLogged(req),
  }

  let perPage = 6
  let page = req.query.pagina || 1

  const data = await articleModel
    .find()
    .populate({
      path: 'author',
      select: 'username',
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'username',
      },
    })
    .sort({ created_at: -1 }) // Ordenar por 'created_at' en orden descendente
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec()

  const count = await articleModel.countDocuments({})
  const nextPage = parseInt(page) + 1
  const hasNextPage = nextPage <= Math.ceil(count / perPage)
  resp.render('article/latest', {
    locals,
    data,
    current: page,
    nextPage: hasNextPage ? nextPage : null,
    currentRoute: '/',
  })
})
