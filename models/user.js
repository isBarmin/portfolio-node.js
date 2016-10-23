'use strict';

let mongoose   = require('mongoose');
let crypto     = require('crypto');
let userSchema = new mongoose.Schema({
    login: {
      type: String,
      required: [true, 'Укажите логин']
    },
    password: {
      type: String,
      required: [true, 'Укажите пароль'],
      set(v) {
        if(v != '') {
          return v;
        } else {
          return crypto.createHash('md5').update(v).digest('hex');
        }
      }
    }
  });


module.exports = mongoose.model('user', userSchema);