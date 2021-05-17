const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const boom = require('@hapi/boom');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const cors = require('cors');

const THIRTY_DAYS_IN_SEC = 60 * 60 * 24 * 30 * 1000;
const TWO_HOURS_IN_SEC = 60 * 60 * 2 * 1000;

const { config } = require('./config');

const app = express();

app.use(cors());

// body parser
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Users
// Basic Strategy
require('./utils/auth/strategies/basic');

app.post('/auth/sign-in', async function (req, res, next) {
  const { rememberMe } = req.body;
  passport.authenticate('basic', function (error, data) {
    try {
      if (error || !data) {
        next(boom.unauthorized());
      }

      req.login(data, { session: false }, async function (error) {
        if (error) {
          next(error);
        } else {
          const { token, ...user } = data;
          res.cookie('token', token, {
            httpOnly: !config.dev,
            secure: !config.dev,
            maxAge: rememberMe ? THIRTY_DAYS_IN_SEC : TWO_HOURS_IN_SEC,
          });

          res.status(200).json(data);
        }
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

app.post('/auth/sign-up', async function (req, res, next) {
  const { body: user } = req;
  try {
    await axios({
      url: `${config.apiUrl}/api/auth/sign-up`,
      method: 'post',
      data: user,
    });

    res.status(201).json({ message: 'user created' });
  } catch (error) {
    next(error);
  }
});

//orders CRUD

//  order
app.post('/orders', async function (req, res, next) {
  try {
    const { body: order } = req;
    const token = req.headers.token;
    const { data, status } = await axios({
        url: `${config.apiUrl}/api/orders`,
        headers: { Authorization: `Bearer ${token}` },
        method: 'post',
        data: order
    });
    if(status !== 201){
        return next(boom.badImplementation());
    }
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// Users CRUD
// Get Users
app.get('/users', async function (req, res, next) {
  try {
    const token = req.headers.token;
    let search = req.query.searchBy || '';
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/users?searchBy=${search}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'get',
      responseType: 'json',
    });
    if (status !== 200) {
      return next(boom.unauthorized());
    }
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

// Get User by Id
app.get('/users/:userId', async function (req, res, next) {
  try {
    const { userId } = req.params;
    const token = req.headers.token;
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/users/${userId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'get',
      responseType: 'json',
    });

    if (status !== 200) {
      return next(boom.unauthorized());
    }
    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
});

// Create User
app.post('/users', async function (req, res, next) {
  try {
    const { body: user } = req;
    const token = req.headers.token;
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/users`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'post',
      data: user,
    });
    if (status !== 201) {
      return next(boom.badImplementation());
    }
    res.status(201).json(data);
  } catch (error) {
    next(err);
  }
});

// update User
app.put('/users/:userId', async function (req, res, next) {
  try {
    const token = req.headers.token;
    const { body: user } = req;
    const { userId } = req.params;
    const { data, status } = new axios({
      url: `${config.apiUrl}/api/users/${userId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'put',
      data: user,
    });
    if (status == !200) {
      return next(boom.badImplementation());
    }
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

// delete User

app.delete('/users/:userId', async function (req, res, next) {
  try {
    const { userId } = req.params;
    const token = req.headers.token;
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/users/${userId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'delete',
      data: userId,
    });

    if (status !== 200) {
      return next(boom.badImplementation());
    }
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// Products CRUD

// get all products
app.get('/products', async function (req, res, next) {
  try {
    //const { token } = req.cookies;
    const token = req.headers.token;
    let search = req.query.searchBy || '';
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/products?searchBy=${search}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'get',
      responseType: 'json',
    });
    if (status !== 200) {
      return next(boom.unauthorized());
    }
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

// get product by id
app.get('/products/:productId', async function (req, res, next) {
  try {
    //const { token } = req.cookies;
    const { productId } = req.params;
    const token = req.headers.token;
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/products/${productId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'get',
      responseType: 'json',
    });
    if (status !== 200) {
      return next(boom.unauthorized());
    }
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

//Create product
app.post('/products', async function (req, res, next) {
  try {
    const { body: product } = req;
    const token = req.headers.token;
    //const { token } = req.cookies;
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/products`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'post',
      data: product,
    });
    if (status !== 201) {
      return next(boom.badImplementation());
    }
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

//delete product by id
app.delete('/products/:productId', async function (req, res, next) {
  try {
    //const { token } = req.cookies;
    const { productId } = req.params;
    const token = req.headers.token;
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/products/${productId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'delete',
      data: productId,
    });

    if (status !== 200) {
      return next(boom.badImplementation());
    }
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

//Update product
app.put('/products/:productId', async function (req, res, next) {
  try {
    //const { token } = req.cookies;
    const token = req.headers.token;
    const { body: product } = req;
    const { productId } = req.params;
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/products/${productId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'put',
      data: product,
    });
    if (status == !200) {
      return next(boom.badImplementation());
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

app.listen(config.port, function () {
  console.log(`Listening http://localhost:${config.port}`);
});
