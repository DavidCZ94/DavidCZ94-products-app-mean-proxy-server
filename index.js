const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const boom = require('@hapi/boom');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const cors = require('cors');

const THIRTY_DAYS_IN_SEC = 2592000000;
const TWO_HOURS_IN_SEC = 7200000;

const { config } = require('./config');

const app = express();

app.use(cors());

// body parser
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Basic Strategy
require('./utils/auth/strategies/basic');

app.post('/auth/sign-in', async function (req, res, next) {
  const { rememberMe } = req.body;
  passport.authenticate('basic', function(error, data){
    try {
        if(error || !data){
            next(boom.unauthorized());
        }

        req.login(data, { session: false }, async function(error){
            if(error){
                next(error);
            }
            
            const { token, ...user } = data;

            res.cookie('token', token, {
                httpOnly: !config.dev,
                secure: !config.dev,
                maxAge: rememberMe ? THIRTY_DAYS_IN_SEC : TWO_HOURS_IN_SEC
            });

            res.status(200).json(data);
        });

    } catch (error) {
        next(error);
    }
  })(req, res, next);
});

app.post('/auth/sign-up', async function (req, res, next) {
    const { body: user } = req;
    try{
        await axios({
            url: `${config.apiUrl}/api/auth/sign-up`,
            method: 'post',
            data: user
        });

        res.status(201).json({ message: 'user created' });
    }catch(error){
        next(error);
    }
});

//Create product
app.post('/products', async function (req, res, next) {
    try {
        const { body: product } = req;
        const { token } = req.cookies;
        const { data, status } = await axios({
            url: `${config.apiUrl}/api/products`,
            headers: { Authorization: `Bearer ${token}`},
            method: 'post',
            data: product
        });
        if( status !== 201 ){
            return next(boom.badImplementation());
        }
        res.status(201).json(data);

    } catch (error) {
        next(error);
    }
});

//delet product by id
app.delete('/products/:productId', async function (req, res, next) {
    try {
        const { productId } = req.params;
        const { token } = req.cookies;
        const { data, status } = await axios({
            url: `${config.apiUrl}/api/products/${productId}`,
            headers: { Authorization: `Bearer ${token}`},
            method: 'delete',
            data: productId
        });

        if( status !== 200 ){
            return next(boom.badImplementation());
        }
        res.status(201).json(data);

    } catch (error) {
        next(error);
    }
});

app.listen(config.port, function () {
  console.log(`Listening http://localhost:${config.port}`);
});
