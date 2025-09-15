const express = require("express");
const { addSuccessStoryController, getAllSuccessStoriesController } = require("../../controllers/successStoryController");


const router = express.Router();

// Add new story
router.post("/success-stories", addSuccessStoryController);

// Get all stories
router.get("/success-stories", getAllSuccessStoriesController);

module.exports = router;
