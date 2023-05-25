const express = require("express"); //create an instance of the Express application.
const path = require("path"); //to enable Cross-Origin Resource Sharing.
const cors = require("cors"); //This module is used to enable Cross-Origin Resource Sharing.
const routers = require("./server/routes/routes.js");

//The desired PORT for the server
const PORT = 3001;

//Instance of the Express application.
const app = express();

app.use(
  "/list",
  express.static(path.join(__dirname, "client/html/list_of_courses.html"))
);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "client")));

/*
Every HTTP request that get into my server will move through the middleware.
app.use(express.json()-> Allows to read json responses.
app.use(express.urlencoded({ extended:true}))-> Allows to read parameters from the URL.
app.use("/", routers)-> every route is going to be routed to the router.
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routers);

app.use("/js", express.static(path.join(__dirname, "client/js")));
app.use("/css", express.static(path.join(__dirname, "client/css")));
app.use("/data", express.static(path.join(__dirname, "server/data")));

const server = app.listen(PORT, () => {
  console.log("listening on port %s...", server.address().port);
});
