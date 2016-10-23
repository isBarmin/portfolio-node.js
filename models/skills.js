'use strict';

let mongoose     = require('mongoose');
let skillsSchema = new mongoose.Schema({
  section: {
    type: String
  },
  items: {
    type: [{
      name: {
        type: String
      },
      value: {
        type: Number,
        default: 0
      }
    }]
  }
});

module.exports = mongoose.model('Skills', skillsSchema);