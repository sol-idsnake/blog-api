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

// first arg passed to model is capital and singular, whereas mongo looks for the same name in plural and 
// non-capitalized in the collections. E.G 'POST', but the collections name is 'posts'
const BlogPost = mongoose.model('Post', blogPostsSchema)


module.exports = {BlogPost}