const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
const {BlogPosts} = require('./models');

//default blog post

BlogPosts.create('the milky way', 'it contains more than 400 billion stars', 'kevin', '6/30/2018')
BlogPosts.create('evolution', 'we are all apes', 'Charles-Darwin', '6/30/2018')
BlogPosts.create('Black holes', 'they\'re vacumes in space', 'Steven Hawking', '6/30/2018')

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author']
    for (i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const createPost = BlogPosts.create(req.body.title, req.body.content, req.body.author, (req.body.publishDate || Date.now()))
    res.status(201).json(createPost);
});

router.delete('/blog-posts/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.id}\``)
    res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = [
        'id', 'title', 'content', 'author', 'publishDate'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
    if (req.params.id !== req.body.id) {
      const message = (
        `Request path id (${req.params.id}) and request body id `
        `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).send(message);
    }
    console.log(`Updating blog post with id \`${req.params.id}\``);
    BlogPosts.update({
      id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      publishDate: req.body.publishDate
    });
    res.status(204).end();
});

module.exports = router;