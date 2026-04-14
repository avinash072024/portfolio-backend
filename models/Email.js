const mongoose = require('mongoose');

const emailSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Please add a firstname'],
    },
    lastname: {
      type: String,
      required: [true, 'Please add a lastname'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
    },
    contact: {
      type: String,
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Email', emailSchema);
