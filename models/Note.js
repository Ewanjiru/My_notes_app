const mongoose = require('mongoose');
const schema = mongoose.Schema;

//create schema
const NoteSchema = new schema({
  title: {
    type: String,
    requires: true,
  },
  details: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model('notes', NoteSchema);