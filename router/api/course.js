const express = require("express");
const {
  addCourseController,
  deleteCourseController,
  updateCourseController,
  getAllCoursesController,
  getSingleCourseController,
} = require("../controllers/courseController");
const upload = require("../middleware/upload");

const router = express.Router();

// Add course (with thumbnail upload)
router.post("/add-course", upload.single("thumbnailImage"), addCourseController);

// Delete course
router.delete("/delete-course/:id", deleteCourseController);

// Update course (PATCH, optional new thumbnail)
router.put("/update-course/:id", upload.single("thumbnailImage"), updateCourseController);

// Get all courses
router.get("/all-courses", getAllCoursesController);

// Get single course by ID
router.get("/course/:id", getSingleCourseController);

module.exports = router;