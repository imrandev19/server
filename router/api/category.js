const express = require("express");
const {
  addCategoryController,
  getAllCategoriesController,
  deleteCategoryController,
  updateCategoryController,
} = require("../../controllers/categoryController");
const adminAccess = require("../../middleware/adminMiddleware");
const upload = require("../../helpers/imageUpload");
const router = express.Router();

router.post(
  "/add-category",
  adminAccess,
  upload.single("thumbnailImage"),
  addCategoryController
);
router.delete("/delete-category/:id", adminAccess, deleteCategoryController);
router.patch(
  "/update-category/:id",
  adminAccess,
  upload.single("thumbnailImage"),
  updateCategoryController
);
router.get("/all-categories", getAllCategoriesController);

module.exports = router;
