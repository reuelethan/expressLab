const express = require("express"); // npm install express
const cors = require("cors"); // npm install cors
const cartRoutes = require('./routes');
const app = express();

// Enable CORS so that this can be used from web-apps on other domains.
app.use(cors());
// Allow JSON request bodies for PUT and POST
app.use(express.json());
// Include the routes from our routes.js file.
app.use("/", cartRoutes);


// define the port
const port = 3000;
// run the server
app.listen(port, () => console.log(`Listening on port: ${port}.`));

console.log(`
its working
`);