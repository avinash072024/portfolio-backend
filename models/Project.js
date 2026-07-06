const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    clientName: {
      type: String
    },
    teamSize: {
      type: Number,
      required: [true, 'Please add a team size'],
    },
    completedYear: {
      type: String,
      required: [true, 'Please add a completed year'],
    },
    desc: {
      type: [String],
      required: [true, 'Please add a description'],
    },
    // image: {
    //   type: String,
    // },
    tools: {
      type: [String],
      required: [true, 'Please add a tools'],
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
