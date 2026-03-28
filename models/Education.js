const mongoose = require('mongoose');

const educationSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    institution: {
      type: String,
      required: [true, 'Please add an institution'],
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

module.exports = mongoose.model('Education', educationSchema);
