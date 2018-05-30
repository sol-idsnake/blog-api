const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const {BlogPosts} = require('./models')

BlogPosts.create('A good day', 'A description of a good day', '')

router.get('/', (req, res) => {
	res.json(BlogPosts.get())
})

router.post('/', (req, res) => {
	const requiredFields = ['title', 'content', 'author-name']
	for (let i=0; i<requiredFields.length; i++) {
		const fields = requiredFields[i]
		console.log(req.body)
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`
			console.error(message)
			return res.status(400).send(message)
		}
	}
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author-name)
	res.status(201).json(item)
})


module.exports = router