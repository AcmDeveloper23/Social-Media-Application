const express = require('express');
const app = express();
const server = require('http').Server(app);
const next = require('next');
// Check Development or Production
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({dev});
const handle = nextApp.getRequestHandler();
require("dotenv").config({ path: "./config.env" });
const connectDb = require("./utilsServer/connectDb");

// Call Mongo DB
connectDb();

// Apply Middleware
app.use(express.json());// For Body-Parser

// We make Server and Client both run on Same Port
const PORT = process.env.PORT || 3000;

nextApp.prepare().then(() => {

    // Apply middleware Routes Routes
    app.use("/api/signup", require("./api/signup"));
    app.use("/api/auth", require("./api/auth"));
    app.use('/api/search',require("./api/search"));
    app.use("/api/posts",require('./api/posts'));
    app.use("/api/profile", require("./api/profile"));

    // This code makes all Page in the NextJs are SSR
    app.all("*", (req,res) => handle(req,res));

    // Listen Server
    server.listen(PORT, err => {
        if(err) throw err;
        console.log(`Express Server running on ${PORT}`);
    })
})