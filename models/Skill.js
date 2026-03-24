const mongoose = require('mongoose');

const skillSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    icon: {
      type: String,
      required: [true, 'Please add an icon'],
    },
    level: {
      type: Number,
      required: [true, 'Please add a level'],
    },
    color: {
      type: String,
      required: [true, 'Please add a color'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Skill', skillSchema);
