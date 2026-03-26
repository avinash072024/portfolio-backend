const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please add a first name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please add a last name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    github: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
    facebook: {
      type: String,
    },
    whatsapp: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Contact', contactSchema);
