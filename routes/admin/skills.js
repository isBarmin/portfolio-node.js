'use strict';

let route      = require('express').Router();
let mongoose   = require('mongoose');
let bodyParser = require('body-parser');

let skills = require('./../../config/skills.json');


// route.use(bodyParser.json());
route.use(bodyParser.urlencoded({ extended: true }));


// Обработка форм
route.post('/',(req, res) => {
  let Model      = mongoose.model('Skills');
  let models     = [];
  let skillsList = {};

  console.log('admin post: save');

  Object.keys(req.body).forEach(key => {
    var val = req.body[key];
    key = key.split('_');

    if( !skillsList[key[1]] ) {
      skillsList[key[1]] = {};
    }
    skillsList[key[1]][key[2]] = val;
  });

  Object.keys(skillsList).forEach(key => {
    var items = [];
    Object.keys(skillsList[key]).forEach(sk_key => {
      items.push({
        name:  sk_key,
        value: skillsList[key][sk_key]
      })
    });
    var toSave = {
      section: key,
      items:   items
    };
    models.push(new Model(toSave));
  });

  if(models.filter(m => m.validateSync()).length) {
    return res.json({error:'Не удалось сохранить данные!'})
  }

  Model.remove({}).then(() =>
    Model.insertMany(models).then(() =>
      res.json({message: 'Соханено!'})
    )
  );
});


module.exports = route;