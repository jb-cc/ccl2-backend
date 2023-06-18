const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { expressjwt: expressJwt } = require('express-jwt');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const app = express();
let corsOptions = {
    origin: 'http://localhost:8081',
    credentials: true,
};


app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

// Use express-jwt middleware
app.use(expressJwt({
    secret: ACCESS_TOKEN_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: true, // if this is "true", all requests without JWT get denied
    getToken: function fromHeaderOrQuerystring (req) { // look for a cookie named "token" in the request
        if (req.cookies && req.cookies.token) {
            console.log("req.cookies.token: " + req.cookies.token);
            return req.cookies.token;

        }
        console.log('req.cookies: '+JSON.stringify(req.cookies));
        return null;
    }
}).unless({
    // Paths that do not require an access token
    path: [
        '/',
        '/register',
        '/login',
        '/listings',
        { url: /^\/listings\/item\/.*/, methods: ['GET'] }, // regex for all paths that start with '/listings/item/'
        '/listings/T',
        '/listings/CT',
        // Other paths...
    ]
}));

app.get('/', (req, res) => {
    res.json({message: 'Welcome to the CCL2 Backend.'});
});

const PORT = process.env.PORT || 8080;

const indexRouter = require('./app/routes/indexRouter.js');
const userRouter = require('./app/routes/userRouter.js');
const listingRouter = require('./app/routes/listingRouter.js');

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/listings', listingRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server error!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}.`);
});