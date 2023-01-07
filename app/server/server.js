const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const hpp = require("hpp");

const HttpError = require("./models/httpError");
const searchRoutes = require("./routes/search");

// Express Application
const app = express();

// Add security headers to response
app.use(helmet());

// Compress the response bodies
app.use(compression());

// Parse the request body & Request size limits
app.use(express.json({ limit: "100kb" }));

// Prevent HTTP Parameter Pollution attacks
app.use(hpp());

// Allowing CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
    );
    next();
});

// use your routes here
app.use("/search", searchRoutes);

// Undefined Routes
app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    throw error;
});

// Error Handler
app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});

// Running our express app
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on port ${port}!`);
});
