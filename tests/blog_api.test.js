const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const listHelper = require("../utils/list_helper");
const Blog = require("../models/blog");

const api = supertest(app);

let token;

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(listHelper.dummyBlogs);

	const userCredentials = {
		username: "testUser",
		password: "testPassword"
	};

	await api
		.post("/api/users")
		.send(userCredentials);
	

	const response = await api
		.post("/api/login")
		.send(userCredentials);
	
	token = response.body.token;
}, 10000);

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
			.set("Authorization", `Bearer ${token}`)
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
			.set("Authorization", `Bearer ${token}`)
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
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(400);
	
		const blogsAtEnd = await listHelper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(listHelper.dummyBlogs.length);
	});
});

describe("deletion of a blog", () => {
	test("succeds with status code 204 if id is valid", async () => {
		const blogAtStart = await listHelper.blogsInDb();
		const blogToDelete = blogAtStart[0];

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(204);
		
		const blogAtEnd = await listHelper.blogsInDb();
		expect(blogAtEnd).toHaveLength(listHelper.dummyBlogs.length - 1);

		const title = blogAtEnd.map(blog => blog.title);
		expect(title).not.toContain(blogToDelete.title);
	});
});

describe("updating a blog", () => {
	test("succeds with status code 200 if id is valid", async () => {
		const blogAtStart = await listHelper.blogsInDb();
		const blogToUpdate = blogAtStart[0];

		const updatedBlog = {
			title: blogToUpdate.title,
			author: blogToUpdate.author,
			url: blogToUpdate.url,
			likes: blogToUpdate.likes + 1
		};

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(updatedBlog)
			.expect(200);
		
		const result = await api.get(`/api/blogs/${blogToUpdate.id}`);
		expect(result.body.likes).toBe(blogToUpdate.likes + 1);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});