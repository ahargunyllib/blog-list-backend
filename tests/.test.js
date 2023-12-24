const listHelper = require("../utils/list_helper");
const blogs = listHelper.dummyBlogs;

describe("dummy", () => {
	test("dummy returns one", () => {
		const result = listHelper.dummy(blogs);
		expect(result).toBe(1);
	});
});

describe("total likes", () => {
	test("total likes return 36", () => {
		const result = listHelper.totalLikes(blogs);
		expect(result).toBe(36);
	});
});

describe("favorite blog", () => {
	test("favorite blog is the 3th", () => {
		const result = listHelper.favoriteBlog(blogs);
		expect(result).toEqual(blogs[2]);
	});
});

describe("most blogs", () => {
	test("author with most blogs is Robert C. Martin with 3 blogs", () => {
		const result = listHelper.mostBlogs(blogs);
		expect(result).toEqual({
			author: "Robert C. Martin",
			blogs: 3
		});
	});
});

describe("most likes", () => {
	test("author with most likes is Edsger W. Dijkstra with 17 likes", () => {
		const result = listHelper.mostLikes(blogs);
		expect(result).toEqual({
			author: "Edsger W. Dijkstra",
			likes: 17
		})
	})
})