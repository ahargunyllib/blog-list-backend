const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const listHelper = require("../utils/list_helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(listHelper.dummyBlogs);
});

describe("when there is initially some blogs saved", () => {
	test("blogs are returned as json", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	}, 10000);

	test("verifies that the unique identifier property of the blog posts is named id", async () => {
		const response = await api.get("/api/blogs");
		expect(response.body[0].id).toBeDefined();
	});
});

describe("addition of a new blog", () => {
	test("a valid blog can be added", async () => {
		const newBlog = {
			title: "Test blog",
			author: "Test author",
			url: "www.test.com",
			likes: 999
		};
	
		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);
		
		const blogsAtEnd = await listHelper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(listHelper.dummyBlogs.length + 1);
	
		const titles = blogsAtEnd.map(blog => blog.title);
		expect(titles).toContain("Test blog");
	});
	
	test("if likes property is missing from the request, it will default to the value 0", async () => {
		const newBlog = {
			title: "Test blog",
			author: "Missing likes",
			url: "www.test.com"
		};
	
		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);
		
		const blogsWithoutLikes = await api.get("/api/blogs?likes=0").expect(200);
		expect(blogsWithoutLikes.body[6].likes).toBe(0);
	});
	
	test("if title and url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request", async () => {
		const newBlog = {
			author: "Ryanmcdermott",
			likes: 99
		};
	
		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(400);
	
		const blogsAtEnd = await listHelper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(listHelper.dummyBlogs.length);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});