const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog
		.find({})
		.populate("user", {
			username: 1,
			name: 1
		});
	response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
	const blogs = await Blog.findById(request.params.id);
	if (blogs) response.json(blogs);
	else response.status(404).end();
});

blogsRouter.post("/", async (request, response) => {
	const body = request.body;
	const user = await User.findById(body.userId);

	if (!body.title || !body.url) {
		return response.status(400).json({ error: "title and url are required" });
	}

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes || 0,
		user: user.id
	});

	const result = await blog.save();
	user.blogs = user.blogs.concat(result._id);
	await user.save();

	response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {
	await Blog.findByIdAndDelete(request.params.id);
	response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
	const body = request.body;

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes || 0
	};

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
	response.json(updatedBlog);
});
    


module.exports = blogsRouter;