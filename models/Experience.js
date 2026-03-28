const mongoose = require('mongoose');

const experienceSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    company: {
      type: String,
      required: [true, 'Please add a company'],
    },
    duration: {
      type: String,
      required: [true, 'Please add a duration'],
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Experience', experienceSchema);
