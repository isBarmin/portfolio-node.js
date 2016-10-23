'use strict';

let route    = require('express').Router();
let mongoose = require('mongoose');
let skills   = require('../config/skills.json');
let config   = require('../config/config.json');


require('../models/post');
require('../models/skills');
require('../models/works');



route.get('/', (req, res) => {
  res.render('pages/index')
});


route.get('/blog.html', (req, res) => {
  let Model = mongoose.model('Post');

  Model.find().then(items => {
    res.render('pages/blog', {items: items});
  })
});


route.get('/works.html', (req, res) => {
  let Model = mongoose.model('Works');

  Model.find().then( items => {
    res.render('pages/works', {works: items});
  })
});


route.get('/about.html', (req, res) => {
  let Model = mongoose.model('Skills');

  Model.find().then(items => {
    let form = items.reduce((prev, cur) => {
      prev[cur.section] = cur.items.reduce((prev, cur) => {
        prev[cur.name] = cur.value;
        return prev;
      }, {});

      return prev;
    }, {});

    Object.keys(skills).forEach(sk_key => {
      Object.keys(skills[sk_key].items).forEach(key => {
        var value = 0;
        if(
          form[skills[sk_key].id] &&
          form[skills[sk_key].id][key]
        ) {
          value = form[skills[sk_key].id][key];
        }

        var name = skills[sk_key].items[key];
        if(name['name'])name = name['name'];
        var item = {
          name:  name,
          value: value,
          key:   key
        };
        skills[sk_key].items[key] = item;
      })
    });
    res.render('pages/about', {skills: skills});
  });
});



module.exports = route;