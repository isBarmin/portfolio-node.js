'use strict';

var mongoose   = require('mongoose');
var workSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Укажите имя проекта']
  },
  tech: {
    type: String,
    required: [true, 'Укажите используемые технологии']
  },
  link: {
    type: String,
    unique: true,
    required: [true, 'Укажите ссылку на проект']
  },
  pictures: {
    type: [String]
  }
});

module.exports = mongoose.model('Works', workSchema);
