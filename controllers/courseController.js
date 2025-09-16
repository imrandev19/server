const CourseModel = require("../models/courseModel");
const fs = require("fs");
const path = require("path");
const slugify = require('slugify')
// ✅ Add Course
async function addCourseController(req, res) {
  try {
    const { title,duration,
      lectures,
      projects, description, price, instructor, category } = req.body;
    const {thumbnailImage} = req.file
        const slug = slugify(title, {
          replacement: '-',  
          remove: undefined, 
          lower: true,  
          trim: true        
        })
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
      duration,
      lectures,
      projects,
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
    const { title, description, price, instructor, category, duration,
      lectures,
      projects, } = req.body;

    // Validate required fields (PUT requires all main fields)
    if (!title || !description || !price || !instructor || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required for full update (PUT)",
      });
    }

    const course = await CourseModel.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ✅ If new thumbnail uploaded → delete old one
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
    }

    // ✅ Replace all fields (full update)
    course.title = title.trim();
    course.description = description;
    course.price = price;
    course.instructor = instructor;
    course.category = category;
    course.thumbnailImage = req.file
      ? `${process.env.SERVER}/${req.file.filename}`
      : course.thumbnailImage; // keep old image if not replaced

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully (PUT)",
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

// ✅ Get All Courses
async function getAllCoursesController(req, res) {
  try {
    const courses = await CourseModel.find({})
      .populate("instructor", "username email") // only selected fields from User
      .populate("category", "name description"); // only selected fields from Category

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch courses.",
      error: error.message,
    });
  }
}

// ✅ Get Single Course
async function getSingleCourseController(req, res) {
  try {
    const { id } = req.params;

    const course = await CourseModel.findById(id)
      .populate("instructor", "username email")
      .populate("category", "name description");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch course.",
      error: error.message,
    });
  }
}

async function getPopularCoursesController(req, res) {
  try {
    // Option 1: Manual flag
    // const popularCourses = await CourseModel.find({ isPopular: true })

    // Option 2: Based on enrollments (>= 100 for example)
    const popularCourses = await CourseModel.find({
      $or: [
        { isPopular: true },
        { enrollments: { $gte: 100 } } // adjust threshold
      ]
    })
      .populate("instructor", "username email")
      .populate("category", "name description");

    if (!popularCourses || popularCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No popular courses found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Popular courses fetched successfully",
      data: popularCourses,
    });
  } catch (error) {
    console.error("Error fetching popular courses:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch popular courses.",
      error: error.message,
    });
  }
}

module.exports = {
  addCourseController,
  deleteCourseController,
  updateCourseController,
  getAllCoursesController,
  getSingleCourseController,
  getPopularCoursesController
};
