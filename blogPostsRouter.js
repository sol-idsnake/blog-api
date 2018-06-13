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

router.get('/posts/:id', (req, res) => {
	BlogPost
		.findById(req.params.id)
		.then(post => {
			const postjson = post.serialize()
			res.json(postjson)
		})
		.catch(err => res.status(500).json({message: 'Internal server error'}))
})

router.post('/posts', (req,res) => {
	const requiredFields = ['title', 'content', 'author']
	for (let i=0; i < requiredFields.length; i++) {
		const field = requiredFields[i]
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` field in request body`
			console.error(message)
			return res.status(400).send(message)
		}
	}

	BlogPost
		.create({
			title: req.body.title,
			content: req.body.content,
			author: req.body.author
		})
		.then(post => res.status(201).json(post.serialize()))
		.catch(err => {
			console.error(err)
			res.status(500).json({message: 'Internal server error'})
		})
})

router.put('/posts/:id', (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		const message = (
	      `Request path id (${req.params.id}) and request body id ` +
	      `(${req.body.id}) must match`);
	    console.error(message);
	    return res.status(400).json({ message: message });
	}

	const toUpdate = {}
	const updateableFields = ['title', 'content', 'author']

	updateableFields.forEach(field => {
		if (field in req.body) {
			toUpdate[field] = req.body[field]
		}
	})

	BlogPost
		.findByIdAndUpdate(req.params.id, {$set: toUpdate}, { new: true })
		.then(post => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}))
})

router.delete('/posts/:id', (req, res) => {
	BlogPost
		.findByIdAndRemove(req.params.id)
		.then(() => {
			console.log(`Deleted post with ID \`${req.params.id}\``)
			res.status(204).end()
		})
		.catch(err => res.status(500).json({message: 'Internal server error'}))
})

module.exports = router