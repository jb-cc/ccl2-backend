// This is the main file for the CCL2 backend. All requests are handled here.
// This backend provides an API for the CCL2 frontend, which can access the API via HTTP requests. I use axios for this.
// Many routes in this file are protected with JWT, so that only logged-in users can access them.
// However, some routes are not protected, as they are used to display items to the user, but the user can not really do anything with them.


// import serverless
const serverless = require('serverless-http');

// Importing necessary libraries and modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { expressjwt: expressJwt } = require('express-jwt'); // JWT middleware for Express
const cookieParser = require('cookie-parser');
require('dotenv').config() // Loads environment variables from a .env file
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET; // Secret for JWT

// Instantiate Express app
const app = express();

// Configuration for CORS middleware
let corsOptions = {

    // origin: 'https://cc221012-10141.node.fhstp.io',
    // origin: 'http://localhost:8081',
    origin: 'https://ccl2.jonasbeer.com/',
    credentials: true,

};

// Use cors middleware with the specified options
app.use(cors(corsOptions));

// Parse JSON bodies for the app
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

// Parse Cookie header and populate req.cookies
app.use(cookieParser());

// Use express-jwt middleware
app.use(expressJwt({
    secret: ACCESS_TOKEN_SECRET, // Secret for JWT
    algorithms: ['HS256'], // Algorithms for JWT
    credentialsRequired: true, // Specifies whether credentials are required
    getToken: function fromHeaderOrQuerystring (req) { // Function to get token from header or query string
        // If a cookie named "token" exists in the request, return it
        if (req.cookies && req.cookies.token) {
            console.log("req.cookies.token: " + req.cookies.token);
            return req.cookies.token;
        }
        console.log('req.cookies: '+JSON.stringify(req.cookies));
        return null; // Return null if no token cookie found
    }
}).unless({
    // Specifies paths that do not require an access token
    path: [
        '/',
        '/register',
        '/login',
        '/listings',
        { url: /^\/listings\/item\/.*/, methods: ['GET'] }, // Regex for all paths that start with '/listings/item/'
        '/listings/T',
        '/listings/CT',
        { url: /^\/inventory\/user\/.*/, methods: ['GET'] }, // same thing for inventory
    ]
}));

// Default route
app.get('/', (req, res) => {
    res.json({message: 'Welcome to the CCL2 Backend.'});
});

// The port the server will listen on, unused on netlify
const PORT = process.env.PORT || 8080;

// Import routers
const indexRouter = require('../../app/routes/indexRouter.js');
const userRouter = require('../../app/routes/userRouter.js');
const listingRouter = require('../../app/routes/listingRouter.js');
const inventoryRouter = require('../../app/routes/inventoryRouter.js');

// Use the imported routers
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/listings', listingRouter);
app.use('/inventory', inventoryRouter);

// Middleware to handle errors
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error stack
    res.status(500).send('Server error!'); // Send server error response
});

export const handler = serverless(app);