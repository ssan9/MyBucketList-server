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
  checked: {type: Boolean, default: false}
});

GoalSchema.methods.serialize = function() {
  return {
    id: this._id,
    description: this.description || '',
    category: this.category || '',
    created: this.created,
    due: this.due,
    checked: this.checked
  };
};

const Goal = mongoose.model('Goal', GoalSchema);

module.exports = {Goal};
