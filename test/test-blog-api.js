'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
// const blogPostsRouter = require('../blogPostsRouter')
const expect = chai.expect;

const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedBlogPostData() {
  console.info('seeding restaurant data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateBlogPostData());
  }
  // this will return a promise
  return BlogPost.insertMany(seedData);
}

function generateBlogPostData() {
  return {
  	title: faker.lorem.words(),
  	content: faker.lorem.paragraph(),
  	author: {
  		firstName: faker.name.firstName(),
  		lastName: faker.name.lastName()
  	},
  	created: faker.date.recent()
  }
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Blog posts API resource', function() {

  // we need each of these hook functions to return a promise
  // otherwise we'd need to call a `done` callback. `runServer`,
  // `seedBlogPostData` and `tearDownDb` each return a promise,
  // so we return the value returned by these function calls.
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedBlogPostData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() {

  	it('should return all existing blog posts', function() {
  		let res
  		return chai.request(app)
  			.get('/posts')
  			.then(function(_res) {
  				res = _res
  				expect(res).to.have.status(200);
          // otherwise our db seeding didn't work
          expect(res.body).to.have.lengthOf.at.least(1);
          return BlogPost.count();
  			})
  	})

  	it('should return restaurants with right fields', function() {
      // Strategy: Get back all restaurants, and ensure they have expected keys

      let resBlogPost
      return chai.request(app)
        .get('/posts')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);

          res.body.forEach(function(blogpost) {
            expect(blogpost).to.be.a('object');
            expect(blogpost).to.include.keys(
              'id', 'title', 'content', 'author', 'created');
          });
          resBlogPost = res.body[0];
          return BlogPost.findById(resBlogPost.id);
        })
        .then(function(blogpost) {

          expect(resBlogPost.id).to.equal(blogpost.id)
          expect(resBlogPost.title).to.equal(blogpost.title)
          expect(resBlogPost.content).to.equal(blogpost.content)
          expect(resBlogPost.author).to.equal(blogpost.author.firstName + ' ' + blogpost.author.lastName)
          // console.log(resBlogPost.created + '------------------')
          // console.log(blogpost.created + '------------------')
          // expect(resBlogPost.created).to.contain(blogpost.created);
        });
    });
  })

  describe('POST endpoint', function() {
  	it('should add a new blog post', function() {

  		const newPost = generateBlogPostData()

  		return chai.request(app)
  			.post('/posts')
  			.send(newPost)
  			.then(function(res) {
  				expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'title', 'content', 'author', 'created')
          expect(res.body.id).to.not.be.null
          expect(res.body.title).to.equal(newPost.title)
          expect(res.body.content).to.equal(newPost.content)
          expect(res.body.author).to.equal(newPost.author.firstName + ' ' + newPost.author.lastName);
          // expect(res.body.author).to.equal(newPost.author)
          // expect(res.body.created).to.equal(newPost.created)

          return BlogPost.findById(res.body.id)
  			})
  			.then(function(post) {
  				expect(newPost.title).to.equal(newPost.title);
  				expect(newPost.content).to.equal(newPost.content);
  				expect(newPost.author).to.equal(newPost.author);
  				expect(newPost.created).to.equal(newPost.created);
  			})
  	})
  })

  describe('PUT endpoint', function() {
  	it('should update fields you send over', function() {
  		const updateData = {
  			title: 'lalalallalalala',
  			content: 'something definitely not important.'
  		}

  		return BlogPost
  			.findOne()
  			.then(function(post) {
  				updateData.id = post.id

  				return chai.request(app)
  					.put(`/posts/${post.id}`)
  					.send(updateData)
  			})
  			.then(function(res) {
  				expect(res).to.have.status(204)

  				return BlogPost.findById(updateData.id)
  			})
  			.then(function(post) {
  				expect(post.title).to.equal(updateData.title);
          expect(post.content).to.equal(updateData.content);
  			})
  	})
  })

  describe('DELETE endpoint', function() {
  	it('delete a post by ID', function() {
  		let post

  		return BlogPost
  			.findOne()
  			.then(function(_post) {
  				post = _post
  				return chai.request(app).delete(`/posts/${post.id}`)
  			})
  			.then(function(res) {
  				expect(res).to.have.status(204)
  				return BlogPost.findById(post.id)
  			})
  			.then(function(_post) {
  				expect(_post).to.be.null
  			})
  	})
  })

})









// const chai = require('chai');
// const chaiHttp = require('chai-http');

// const {app, closeServer, runServer} = require('../server');
// const expect = chai.expect;

// const { TEST_DATABASE_URL } = require('../config')

// chai.use(chaiHttp);


// describe('Blog Api', function() {
// 	before(function() {
// 		return runServer(TEST_DATABASE_URL)
// 	})
// 	after(function() {
// 		return closeServer()
// 	})

// 	it('should list items on GET', function(done) {
// 		return chai.request(app)
// 			.get('/posts')
// 			.then(function(res) {
// 		        expect(res).to.have.status(200);
// 		        expect(res).to.be.json;
// 		        expect(res.body).to.be.a('array');
// 		        expect(res.body.length).to.be.at.least(1);
// 		        const expectedKeys = ['title', 'content', 'author'];
// 		        res.body.forEach(function(item) {
// 					expect(item).to.be.a('object');
// 					expect(item).to.include.keys(expectedKeys);
// 				})
// 			})
// 			done()
// 	})

// 	it('should create items on POST', function() {
// 		const newItem = {title: 'A stellar day', content: 'When you get up in the morning to have a stellar day...', author: 'me', created: Date.now()}
// 		return chai.request(app)
// 			.post('/posts')
// 			.send(newItem)
// 			.then(function(res){
// 				expect(res).to.have.status(201);
// 				expect(res).to.be.json;
// 				expect(res.body).to.be.a('object');
// 				expect(res.body).to.include.keys('title', 'content', 'author');
// 				expect(res.body.id).to.not.equal(null);	
// 				expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id, created: res.body.created}));
// 			})
// 	})

// 	it('should update items on PUT', function() {
// 		return chai.request(app)
// 			.get('/posts')
// 			.then(function(res) {
// 				const updateData = Object.assign(res.body[0], {
// 					title: 'A mockingbird',
// 					content: 'Once upon a time there was a mockingbird...',
// 					author: 'not me',
// 					publishDate: Date.now()
// 				})
// 				return chai.request(app)
// 					.put(`/posts/${updateData.id}`)
// 					.send(updateData)
// 			})
// 			.then(function(res) {
// 				expect(res).to.have.status(204);
// 				expect(res.body).to.be.a('object');
//       });
// 	})

// 	it('should delete an item on DELETE', function() {
// 		return chai.request(app)
// 		.get('/posts')
// 		.then(function(res) {
// 			return chai.request(app)
// 				.delete(`/posts/${res.body[0].id}`)
// 		})
// 	})
// })