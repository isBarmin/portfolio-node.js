'use strict';

let route      = require('express').Router();
let nodemailer = require('nodemailer');
let bodyParser = require('body-parser');
let config     = require('../config/config.json');

// route.use(bodyParser.json());
route.use(bodyParser.urlencoded({ extended: true }));

route.post('/', (req, res) => {
  console.log('send mail');
  console.log( req.body );

  if(!req.body.name || !req.body.email || !req.body.message) {
    return res.send(JSON.stringify({error:'Заполните форму'}));
  }

  let transporter = nodemailer.createTransport(config.mail.smtp);
  let mailOptions = {
      from:    `"${req.body.name}"<${req.body.email}>`,
      to:      config.mail.smtp.auth.user,
      subject: config.mail.subject,
      text:    req.body.message.trim().slice(0,500)
    };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err) {
      return res.send(JSON.stringify({error: err.message}));
    }

    res.json({});
  })
});

module.exports = route;
