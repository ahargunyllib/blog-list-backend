const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
	const body = request.body;

	if (!body.title || !body.url) {
		return response.status(400).json({ error: "title and url are required" });
	}

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes || 0
	});

	try {
		const result = await blog.save();
		response.status(201).json(result);
	} catch (exception) {
		next(exception);
	}
});
    


module.exports = blogsRouter;