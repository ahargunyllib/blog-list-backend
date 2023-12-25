const Blog = require("../models/blog");
const User = require("../models/user");

const dummyBlogs = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		__v: 0
	},
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
		__v: 0
	},
	{
		_id: "5a422b3a1b54a676234d17f9",
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
		__v: 0
	},
	{
		_id: "5a422b891b54a676234d17fa",
		title: "First class tests",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
		likes: 10,
		__v: 0
	},
	{
		_id: "5a422ba71b54a676234d17fb",
		title: "TDD harms architecture",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
		likes: 0,
		__v: 0
	},
	{
		_id: "5a422bc61b54a676234d17fc",
		title: "Type wars",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
		likes: 2,
		__v: 0
	}
];

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	return blogs.reduce((accumulator, currentBlog) => accumulator + currentBlog.likes, 0);
};

const favoriteBlog = (blogs) => {
	let mostLikesBlog = blogs[0];
	blogs.forEach((blog) => {
		if (blog.likes > mostLikesBlog.likes) {
			mostLikesBlog = blog;
		}
	});
	return mostLikesBlog;
};

const mostBlogs = (blogs) => {
	let mostBlogsAuthor = blogs[0];
	let mostBlogsCount = 0;
	blogs.forEach((blog) => {
		let currentAuthorBlogsCount = 0;
		blogs.forEach((blog2) => {
			if (blog.author === blog2.author) {
				currentAuthorBlogsCount++;
			}
		});

		if (currentAuthorBlogsCount > mostBlogsCount) {
			mostBlogsCount = currentAuthorBlogsCount;
			mostBlogsAuthor = blog.author;
		}
	});

	return {
		author: mostBlogsAuthor,
		blogs: mostBlogsCount
	};
};

const mostLikes = (blogs) => {
	let mostLikesAuthor = blogs[0];
	let mostLikesCount = 0;
	blogs.forEach((blog) => {
		let currentAuthorLikesCount = 0;
		blogs.forEach((blog2) => {
			if (blog.author === blog2.author) {
				currentAuthorLikesCount += blog2.likes;
			}
		});

		if (currentAuthorLikesCount > mostLikesCount) {
			mostLikesCount = currentAuthorLikesCount;
			mostLikesAuthor = blog.author;
		}
	});

	return {
		author: mostLikesAuthor,
		likes: mostLikesCount
	};
};

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map(user => user.toJSON());
};

module.exports = {
	dummyBlogs,
	dummy,
	totalLikes,	
	favoriteBlog,
	mostBlogs,
	mostLikes,
	blogsInDb,
	usersInDb,
};