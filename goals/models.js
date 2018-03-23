'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const GoalSchema = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: new Date()
  },
  due: {type: Date, default: new Date()},
  checked: {type: Boolean, default: false},
  completed: {type: Date, default: new Date()}  
});

GoalSchema.methods.serialize = function() {
  return {
    id: this._id,
    description: this.description || '',
    category: this.category || '',
    created: this.created.toISOString().substr(0, 10),
    due: this.due.toISOString().substr(0, 10),
    checked: this.checked,
    completed: this.completed.toISOString().substr(0, 10)
  };
};

const Goal = mongoose.model('Goal', GoalSchema);

module.exports = {Goal};
