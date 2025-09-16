const express = require("express");
const {
  addCourseController,
  deleteCourseController,
  updateCourseController,
  getAllCoursesController,
  getSingleCourseController,
  getPopularCoursesController
} = require("../../controllers/courseController");
const upload = require("../../helpers/imageUpload");
const adminAccess = require("../../middleware/adminMiddleware");

const router = express.Router();

// Add course (with thumbnail upload)
router.post("/add-course", adminAccess, upload.single("thumbnailImage"), addCourseController);

// Delete course
router.delete("/delete-course/:id", adminAccess, deleteCourseController);

// Update course (PATCH, optional new thumbnail)
router.put("/update-course/:id", adminAccess, upload.single("thumbnailImage"), updateCourseController);

// Get all courses
router.get("/all-courses", getAllCoursesController);

// Get single course by ID
router.get("/course/:id", getSingleCourseController);

// Get all popular courses
router.get("/popular-courses", getPopularCoursesController);

module.exports = router;