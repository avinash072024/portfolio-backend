const mongoose = require('mongoose');

const skillCategorySchema = mongoose.Schema(
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

module.exports = mongoose.model('SkillCategory', skillCategorySchema);
