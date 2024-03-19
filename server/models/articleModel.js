const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentModel = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  likes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
})

const articleModel = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  likes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  comments: [commentModel],
})

module.exports = mongoose.model('article', articleModel)
