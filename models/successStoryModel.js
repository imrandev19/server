const mongoose = require("mongoose");
const { Schema } = mongoose;

const successStorySchema = new Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      maxlength: [100, "Student name too long"],
    },

    storyText: {
      type: String,
      required: [true, "Story text is required"],
      trim: true,
      maxlength: [2000, "Story text too long"],
    },

    // Reference or plain string depending on your setup
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },

    // Optional: link story to a Course document
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const SuccessStoryModel = mongoose.model("SuccessStory", successStorySchema);
module.exports = SuccessStoryModel;