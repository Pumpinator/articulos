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
    .aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: {
          path: '$author',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'comments.author',
          foreignField: '_id',
          as: 'comments.author',
        },
      },
      {
        $unwind: {
          path: '$comments.author',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          title: 1,
          body: 1,
          'author._id': 1,
          'author.username': 1,
          likes: 1,
          dislikes: 1,
          created_at: 1,
          updated_at: 1,
          'comments.author._id': 1,
          'comments.author.username': 1,
          __v: 1,
        },
      },
    ])
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
