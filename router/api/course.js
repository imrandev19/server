const express = require("express");
const {
  addCourseController,
  deleteCourseController,
  updateCourseController,
} = require("../controllers/courseController");
const upload = require("../middleware/upload");

const router = express.Router();

// Add course (with thumbnail upload)
router.post("/add-course", upload.single("thumbnailImage"), addCourseController);

// Delete course
router.delete("/delete-course/:id", deleteCourseController);

// Update course (PATCH, optional new thumbnail)
router.patch("/update-course/:id", upload.single("thumbnailImage"), updateCourseController);

module.exports = router;