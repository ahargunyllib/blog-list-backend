require("express-async-errors");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

const app = express();

mongoose.set("strictQuery", false);
logger.info("connecting to ", config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
	.then(() => logger.info("connected to MongoDB"))
	.catch((error) => logger.error("error connecting to MongoDB: ", error.message));

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body "));

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;