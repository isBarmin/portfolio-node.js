'use strict';

let route      = require('express').Router();
let mongoose   = require('mongoose');
let crypto     = require('crypto');
let bodyParser = require('body-parser');


route.use(bodyParser.urlencoded({ extended: true }));


route.post('/', (req, res) => {
  let login   = req.body.login;
  let pass    = req.body.password;
  let isHuman = req.body.isHuman;
  let really  = req.body.reallyHuman;


  if(!isHuman || !really || really == 'no') {
    return res.send(JSON.stringify({error: 'Роботам здесь не место'}));
  }

  if(!login || !pass) {
    return res.send(JSON.stringify({error: 'Укажите логин и пароль'}));
  }

  let Model    = mongoose.model('user');
  let password = crypto.createHash('md5')
      .update(req.body.password)
      .digest('hex')

  Model.findOne({
    login:    req.body.login,
    password: password
  }).then(item => {

    if(!item) {
      res.send(JSON.stringify({error: 'invalid username or password'}));
    } else {
      req.session.isAdmin = true;
      res.send(JSON.stringify({
        href: '/admin',
        message: 'Authorization: success'
      }));
    }
  })
});


module.exports = route;