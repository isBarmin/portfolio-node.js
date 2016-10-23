'use strict';

let mongoose = require('./models/mongoodb');
let readline = require('readline');
let crypto   = require('crypto');
let rl       = readline.createInterface({
                input:  process.stdin,
                output: process.stdout
              });
let login    = '';
let password = '';

rl.question('Логин: ', answer => {
  login = answer;

  rl.question('Пароль: ', answer => {
    password = answer;
    rl.close();
  })
});

rl.on('close',() => {
  require('./models/user');
  password=crypto.createHash('md5').update(password).digest("hex");

  let User = mongoose.model('user'),
    adminUser = new User({
      login:    login,
      password: password
    });

  User.findOne({login: login}).then( u => {
    if(u) {
      throw new Error('Такой пользователь уже существует!');
    }

    return adminUser.save();
  }).then (
    u => console.log('User \x1b[36m'+login+'\x1b[0m add'),
    e => console.log(e.message)
  ).then(() => process.exit(0))
});