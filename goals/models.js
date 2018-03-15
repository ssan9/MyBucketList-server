'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const GoalSchema = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: new Date()
  },
  due: {type: Date, default: new Date()},
  checked: {type: Boolean, default: false}
});

GoalSchema.methods.serialize = function() {
  return {
    description: this.username || '',
    created: this.firstName || '',
    due: this.lastName || '',
    checked: this.checked
  };
};

const Goal = mongoose.model('Goal', GoalSchema);

module.exports = {Goal};
