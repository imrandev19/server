const express = require("express");
const { addSuccessStoryController, getAllSuccessStoriesController } = require("../../controllers/successStoryController");
const adminAccess = require("../../middleware/adminMiddleware");
const upload = require("../../helpers/imageUpload");


const router = express.Router();

// Add new story
router.post("/add-success-stories", adminAccess, upload.single('thumbnailImage'), addSuccessStoryController);

// Get all stories
router.get("/success-stories", getAllSuccessStoriesController);

module.exports = router;
