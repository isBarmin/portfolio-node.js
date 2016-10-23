'use strict';

let route      = require('express').Router();
let mongoose   = require('mongoose');
let bodyParser = require('body-parser');

// route.use(bodyParser.json());
route.use(bodyParser.urlencoded({ extended: true }));


route.post('/', (req, res) => {
  let Model = mongoose.model('Post');
  let date = req.body.date;
  date = (date) ? new Date(date) : new Date();
  let dateFormat = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

  console.log( dateFormat );

  let post = new Model({
    date:  dateFormat,
    title: req.body.title,
    body:  req.body.body
  });

  post.save().then(
    i => res.send(JSON.stringify({message:'Запись добавленна!'})),
    e => {
      let error = Object.key(e.errors)
        .map(key => e.errors[key].message)
        .join(', ');

      res.send(JSON.stringify({error: error}));
    }
  )
});


module.exports = route;