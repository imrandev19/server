const express = require('express')
const { addCategoryController, deleteCategoryController, updateCategoryController } = require('../../controllers/categoryController')
const adminAccess = require('../../middleware/adminMiddleware')
const upload = require('../../helpers/imageUpload')
const router = express.Router()

router.post('/add-category', upload.single('thumbnailImage') ,  addCategoryController)
router.delete("/delete-category/:id", deleteCategoryController);
router.patch("/update-category/:id", upload.single("thumbnailImage"), updateCategoryController);
module.exports = router