const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    designation: {
      type: String,
      required: [true, 'Please add a designation'],
    },
    organization: {
      type: String,
      required: [true, 'Please add an organization'],
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating'],
      min: 1,
      max: 5,
    },
    verified: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
