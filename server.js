const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
let corsOptions = {
    origin: 'http://localhost:8081'
}

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.json({message: 'Welcome to the CCL2 Backend.'});
});

const PORT = process.env.PORT || 8080;

const indexRouter = require('./app/routes/indexRouter.js');
const userRouter = require('./app/routes/userRouter.js');

app.use('/', indexRouter);
app.use('/users', userRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}.`);
});