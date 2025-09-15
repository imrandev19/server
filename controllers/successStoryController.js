const SuccessStoryModel = require("../models/successStoryModel");

// ✅ Add New Success Story
async function addSuccessStoryController(req, res) {
  try {
    const { studentName, storyText, courseName, course } = req.body;

    if (!studentName || !storyText || !courseName) {
      return res.status(400).json({
        success: false,
        message: "studentName, storyText, and courseName are required",
      });
    }

    const newStory = new SuccessStoryModel({
      studentName: studentName.trim(),
      storyText: storyText.trim(),
      courseName: courseName.trim(),
      course: course || null,
    });

    await newStory.save();

    res.status(201).json({
      success: true,
      message: "Success story added successfully",
      data: newStory,
    });
  } catch (error) {
    console.error("Error adding success story:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not add success story.",
      error: error.message,
    });
  }
}

// ✅ Get All Success Stories
async function getAllSuccessStoriesController(req, res) {
  try {
    const stories = await SuccessStoryModel.find({})
      .populate("course", "title price") // optional, populate course info
      .sort({ createdAt: -1 }); // latest first

    if (!stories || stories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No success stories found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Success stories fetched successfully",
      data: stories,
    });
  } catch (error) {
    console.error("Error fetching success stories:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch success stories.",
      error: error.message,
    });
  }
}

module.exports = {
  addSuccessStoryController,
  getAllSuccessStoriesController,
};
