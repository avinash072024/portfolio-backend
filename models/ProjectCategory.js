const mongoose = require('mongoose');

const projectCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ProjectCategory', projectCategorySchema);
