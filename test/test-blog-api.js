const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);


describe('Blog Api', function() {
	before(function() {
		return runServer()
	})
	after(function() {
		return closeServer()
	})

	it('should list items on GET', function() {
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
		        expect(res).to.have.status(200);
		        expect(res).to.be.json;
		        expect(res.body).to.be.a('array');
		        expect(res.body.length).to.be.at.least(1);
		        const expectedKeys = ['title', 'content', 'author'];
		        res.body.forEach(function(item) {
					expect(item).to.be.a('object');
					expect(item).to.include.keys(expectedKeys);
				})
			})
	})

	it('should create items on POST', function() {
		const newItem = {title: 'A stellar day', content: 'When you get up in the morning to have a stellar day...', author: 'me', publishDate: Date.now()}
		return chai.request(app)
			.post('/blog-posts')
			.send(newItem)
			.then(function(res){
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.include.keys('title', 'content', 'author');
				expect(res.body.id).to.not.equal(null);	
				expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id, publishDate: res.body.publishDate}));
			})
	})

	it('should update items on PUT', function() {
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				const updateData = Object.assign(res.body[0], {
					title: 'A mockingbird',
					content: 'Once upon a time there was a mockingbird...',
					author: 'not me',
					publishDate: Date.now()
				})
				return chai.request(app)
					.put(`/blog-posts/${updateData.id}`)
					.send(updateData)
			})
			.then(function(res) {
				expect(res).to.have.status(204);
				expect(res.body).to.be.a('object');
      });
	})

	it('should delete an item on DELETE', function() {
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			return chai.request(app)
				.delete(`/blog-posts/${res.body[0].id}`)
		})
	})
})