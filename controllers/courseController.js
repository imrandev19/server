const CourseModel = require("../models/courseModel");
const fs = require("fs");
const path = require("path");

// ✅ Add Course
async function addCourseController(req, res) {
  try {
    const { title, description, price, instructor, category } = req.body;

    if (!title || !description || !price || !instructor || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newCourse = new CourseModel({
      title: title.trim(),
      description,
      price,
      instructor,
      category,
      thumbnailImage: req.file ? `${process.env.SERVER}/${req.file.filename}` : null,
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not create course.",
      error: error.message,
    });
  }
}

// ✅ Delete Course
async function deleteCourseController(req, res) {
  try {
    const { id } = req.params;

    const course = await CourseModel.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Delete thumbnail if exists
    if (course.thumbnailImage) {
      const oldFileName = course.thumbnailImage.split("/").pop();
      const oldFilePath = path.join(__dirname, "..", "uploads", oldFileName);

      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error("Error deleting thumbnail:", err.message);
        } else {
          console.log("Thumbnail deleted:", oldFileName);
        }
      });
    }

    await CourseModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      deletedCourse: course,
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not delete course.",
      error: error.message,
    });
  }
}

// ✅ Update Course (PATCH)
async function updateCourseController(req, res) {
  try {
    const { id } = req.params;
    const { title, description, price, instructor, category } = req.body;

    const course = await CourseModel.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Update only provided fields
    if (title) course.title = title.trim();
    if (description) course.description = description;
    if (price) course.price = price;
    if (instructor) course.instructor = instructor;
    if (category) course.category = category;

    // Handle thumbnail update
    if (req.file) {
      if (course.thumbnailImage) {
        const oldFileName = course.thumbnailImage.split("/").pop();
        const oldFilePath = path.join(__dirname, "..", "uploads", oldFileName);

        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Error deleting old thumbnail:", err.message);
          } else {
            console.log("Old thumbnail deleted:", oldFileName);
          }
        });
      }

      course.thumbnailImage = `${process.env.SERVER}/${req.file.filename}`;
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not update course.",
      error: error.message,
    });
  }
}

module.exports = {
  addCourseController,
  deleteCourseController,
  updateCourseController,
};
