
/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const fs = require('fs');
const path = require("path");


// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  https: {
    key: fs.readFileSync(path.join(__dirname, 'cert/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert/cert.pem'))
  },
  // Set this to true for detailed logging:
  logger: true,
});

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "src"),
  prefix: "/", // optional: default '/'
  setHeaders: (res, pathName) => {
    //  res.setHeader("Access-Control-Allow-Headers", "*");
    //  res.setHeader("Access-Control-Allow-Methods", "*");
    //  res.setHeader("Access-Control-Allow-Origin", "*");
    //  res.setHeader("Referrer-Policy","strict-origin-when-cross-origin");
    //  res.setHeader("Vary","Accept-Encoding");
    //  res.setHeader("Transfer-Encoding","Identity");
  },
});





// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
console.log("Started Simple HTML page that initializes and uses ping-oidc-client-sdk static js");



// Run the server and report out to the logs
fastify.listen(
  { port: 3001, host: "127.0.0.1" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);



