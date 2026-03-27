const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    icon: {
      type: String,
      required: [true, 'Please add an icon'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    features: {
      type: [String],
      required: [true, 'Please add at least one feature'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
