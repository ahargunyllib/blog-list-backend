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

module.exports = {
	dummy,
	totalLikes,	
	favoriteBlog,
	mostBlogs,
	mostLikes
};