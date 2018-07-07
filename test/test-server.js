const chai = require('chai');
const chaiHttp = require("chai-http");
const { app, runServer, closeServer } = require("../server")

const expect = chai.expect
chai.use(chaiHttp)

describe ("BlogPosts", function() {
    before(function() {
        return runServer();
    });
    after(function() {
        return closeServer();
    });
    it("should return blog post on GET", function(){
        return chai
        .request(app)
        .get("/blog-posts")
        .then(function(res) {
            expect(res).to.have.status(200)
            expect(res).to.be.json;
            expect(res.body).to.be.a("array");
            expect(res.body.length).to.be.at.least(1);
            const expectedKeys = ['id', 'content', 'author', 'publishDate'];
            res.body.forEach(function(item){
                expect(item).to.be.a("object")
                expect(item).to.include.keys(expectedKeys)
            });
        });
    });
    it("should add a blog post on POST", function(){
        const newPost = {title: "Cetaphil", content: "its good for your skin!", author: "some doctor"}
        return chai
        .request(app)
        .post("/blog-posts")
        .send(newPost)
        .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a("object");
            expect(res.body).to.include.keys("title", "content", "author", "publishDate");
            expect(res.body).to.not.equal(null)
            // expect(res.body).to.deep.equal(
            //     Object.assign(newPost, { id: res.body.id })
            // how do i check for the publishDate?
            // );
        })
    })
    it("should edit a blog post on PUT", function(){
        const updatePost = {title: "Groot", content: "i am groot", author: "Groot", publishDate: "7/5/2018"}
        return (
            chai
            .request(app)
            .get("/blog-posts")
            .then(function(res) {
                updatePost.id = res.body[0].id;
                return chai
                .request(app)
                .put(`/blog-posts/${updatePost.id}`)
                .send(updatePost)
            })
            .then(function(res) {
                expect(res).to.have.status(204)
            })
        )
    })
    it("should delete an item on delete", function() {
        return chai
        .request(app)
        .get("/blog-posts")
        .then(function(res) {
            const blogID = res.body[0].id;
            return chai
            .request(app)
            .delete(`blog-posts/${blogID}`)
            .then(function(res) {
                expect(res).to.have.status(204)
            })
        })
    })
})
