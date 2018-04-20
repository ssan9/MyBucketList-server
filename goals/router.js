'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {Goal} = require('./models');
const { User } = require("../users/models");
const passport = require("passport");
const jwtAuth = passport.authenticate("jwt", { session: false });

router.get("/goals", jwtAuth, (req, res) => {
  var user;
  User.findById(req.user.id)
    .then(_user => (user = _user))
    .then(() => 
      Goal.find({
        user: req.user.id
      })
    )
    .then(goals => {
      return res.json({
        checked: user.checked,
        unchecked: user.unchecked,
        description: user.description,
        category: user.category,
        created: user.created,
        due: user.due,
        completed: user.completed
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: "something went teribly wrong" });
    });
});

router.get('/', jwtAuth, (req, res) => {
  Goal
    .find({user: req.user.id})
    .then(goals => {
      res.json(goals.map(goal => goal.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

router.get('/:id', jwtAuth, (req, res) => {
  Goal
    .findById(req.params.id)
    .then(goal => res.json(goal.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

router.post('/', jwtAuth, (req, res) => {
  const requiredFields = ['description', 'category'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Goal
    .create({
      description: req.body.description,
      category: req.body.category,
      due: req.body.due,
      checked: req.body.checked,
      completed: req.body.completed 
    })
    .then(goal => res.status(201).json(goal.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });

});


router.delete('/:id', jwtAuth, (req, res) => {
  Goal
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});


router.put('/:id', jwtAuth, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['description', 'category', 'due', 'checked', 'completed'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Goal
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedGoal => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


module.exports = {router};
