const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

mongoose.Promise = global.Promise
const {BlogPost} = require('./models')

const app = express();
app.use(express.json());

router.get('/posts', (req, res) => {
	BlogPost
		.find()
		.then(posts => {
			res.json(posts.map(post => post.serialize()))
		})
		.catch(err => {
			console.error(err)
			res.status(500).json({ message: 'Internal server error' })
		})
})

// 5b1fc5422691867a687f1d82
router.get('/posts/:id', (req, res) => {
	BlogPost
		.findById(req.params.id)
		.then(post => {
			console.log(post)
			const postjson = post.serialize()
			res.json(postjson)
		})
})

// router.post('/', jsonParser, (req, res) => {
// 	const requiredFields = ['title', 'content', 'author']
// 	for (let i=0; i<requiredFields.length; i++) {
// 		const field = requiredFields[i]
// 		if (!(field in req.body)) {
// 			const message = `Missing ${field} in request body`
// 			console.error(message)
// 			return res.status(400).send(message)
// 		}
// 	}
// 	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author)
// 	res.status(201).json(item)
// })

// router.put('/:id', jsonParser, (req, res) => {
// 	const requiredFields = ['title', 'content', 'author', 'publishDate'];
// 	for (let i=0; i<requiredFields.length; i++) {
// 		const field = requiredFields[i];
// 		if (!(field in req.body)) {
// 			const message = `Missing \`${field}\` in request body`
// 			console.error(message);
// 			return res.status(400).send(message);
// 		}
// 	}
// 	if (req.params.id !== req.body.id) {
// 	    const message = (
// 			`Request path id (${req.params.id}) and request body id `
// 			`(${req.body.id}) must match`);
// 			console.error(message);
// 		return res.status(400).send(message);
// 	}
// 	console.log(`Updating Blog Post with ID \`${req.params.id}\``);
// 	const updatedItem = BlogPosts.update({
// 		id: req.params.id,
// 		title: req.body.title,
// 		content: req.body.content,
// 		author: req.body.author,
// 		publishDate: req.body.publishDate
// 	});
// 	res.status(204).end();
// })

// router.delete('/:id', (req, res) => {
// 	BlogPosts.delete(req.params.id)
// 	console.log(`Deleted blog post with ID ${req.params.id}`)
// 	res.status(204).end()
// })

module.exports = router