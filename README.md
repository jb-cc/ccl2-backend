# SKINFINITY CS:GO SkinMarketplace - Backend (CCL2)

Skinfinity is a CS:GO Skin marketplace that allows users to buy and sell (not real) CS:GO Skins. It is a project for the
final project (Creative Code Lab) of the second semester of the Bachelor's degree program "Creative Computing" at the
St. Pölten University of Applied Sciences.

## Installation

Clone the repositories:
https://git.nwt.fhstp.ac.at/cc221012/ccl2-backend
https://git.nwt.fhstp.ac.at/cc221012/ccl2frontend

There are three parts to this Project, the Frontend, the Backend, and the database. You need all of them to run this
app.
You need Node.js on your system to run this web application. You also need a MySQL database, as well as an IDE that can
edit JavaScript.

To install the dependencies, open the root folder of both Backend and Frontend in your IDE, and run

```bash
npm install
```

in your terminal.

(BACKEND):
Then, create a .env file in the root of the CCL SERVER directory. This file will contain the required configurations for
the API. You can use a text editor to create and edit this file. Example .env file:

```javascript
DB_USERNAME = username
DB_PASSWORD = password
ACCESS_TOKEN_SECRET = secret

```

replace the values with your database credentials, and create a new secret

Currently, you can get the database schema by contacting me, until I upload it here in the near future.

In the version you clone from git (or download from the ecampus), the ports and urls are set to http://localhost:8081/ (
this is where the frontend is running) and http://localhost:8080/ (for the backend).
If you want to change this, run a replace all in your frontend, and replace http://localhost:8080/ with the desired
backend url. In the Backend, you have to navigate to the server.js file, and change the origin to your new frontend
address

```
let corsOptions = {
    // origin: 'https://cc221012-10141.node.fhstp.io',
    origin: 'http://localhost:8081',
    credentials: true,
};
```

also, change your port to your new port the backend runs at: (also server.js)

```
// The port the server will listen on
const PORT = process.env.PORT || 8080;

```

just to be sure, run

```
npm install
```

again.

These are the dependencies for the backend:

```
"dependencies": {
"bcrypt": "^5.1.0",
"body-parser": "^1.20.2",
"cookie-parser": "^1.4.6",
"cors": "^2.8.5",
"dotenv": "^16.1.4",
"express": "^4.18.2",
"express-jwt": "^8.4.1",
"jsonwebtoken": "^9.0.0",
"mysql": "^2.18.1"
}
```

These are the dependencies for the frontend:

```
"dependencies": {
    "autoprefixer": "^10.4.14",
    "axios": "^1.4.0",
    "pinia": "^2.1.4",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.2",
    "vue": "^3.3.4",
    "vue-router": "^4.2.2"
 }
```

Then, to start the backend, run

```
node server.js
```

and the frontend (in the CCL2 Frontend directory) with

```
npm run dev
```

## Usage

Go to http://localhost:8081/ in your browser, or to the route you customized.
Have fun buying and selling skins

## Troubleshooting

Make sure all dependencies are properly installed.
Double-check the configuration of environment variables in the .env file.
Ensure your database connection details are accurate.
Check the console for any error messages.

If you are still unable to resolve the issue, please contact me at the email address below.

cc221012@fhstp.ac.at
