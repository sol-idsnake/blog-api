const uuid = require('uuid');
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const blogPostsSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  },
  created: {type: Date, default: Date.now}
})

// (http://mongoosejs.com/docs/guide.html#virtuals)
blogPostsSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`
})

blogPostsSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorName,
    created: this.created
  }
}

const BlogPost = mongoose.model('BlogPosts', blogPostsSchema)


module.exports = {BlogPost}