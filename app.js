const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const converterRoutes = require('./api/routes/convert');
const harmonyRoutes = require('./api/routes/harmony');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//add headers to handle CORS errors
app.use((req, res, next) => {

    //allow access to all origins
    res.header('Access-Control-Allow-Origin', '*'); 
    
    //specify which headers to allow
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');

    //specify which methods are supported if asked
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET');
        return res.status(200).json({});
    }

    next();
});

app.use('/convert', converterRoutes);
app.use('/harmony', harmonyRoutes);

//error - couldn't find route
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//handle thrown errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    console.log(error);
    res.send({
        status: 0,
        path:`${req.baseUrl}${req.path}`,
        message: "server error occurred"
    });
});


module.exports = app;