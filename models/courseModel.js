const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [200, "Title too long (max 200 chars)"],
    },

    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    // ✅ Popularity fields
    isPopular: {
      type: Boolean,
      default: false, // manual flag
    },
    enrollments: {
      type: Number,
      default: 0, // can auto-increment when a student enrolls
    },

    // Instructor can be a user reference
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming you have a User model
      required: [true, "Instructor is required"],
    },

    // Relation with Category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    // Thumbnail (image or video URL from uploads)
    thumbnailImage: {
      type: String,
      trim: true,
    },

    // Optional: mark course as published/draft
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CourseModel = mongoose.model("Course", courseSchema);
module.exports = CourseModel;
