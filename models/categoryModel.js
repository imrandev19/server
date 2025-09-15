// models/categoryModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Category name too long (max 100 chars)'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description too long (max 300 chars)'],
    },

    slug: {
      type: String,
    },

    // For hierarchical categories (optional)
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },

    thumbnailImage: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^(https?:\/\/).+\.(png|jpg|jpeg|webp|svg)$/i.test(v);
        },
        message: 'thumbnailImage must be a valid image URL',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to auto-generate slug
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
