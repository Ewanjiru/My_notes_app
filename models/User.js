const mongoose = require('mongoose');
const schema = mongoose.Schema;

//create schema
const UserSchema = new schema({
  name: {
    type: String,
    requires: true,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model('users', UserSchema);