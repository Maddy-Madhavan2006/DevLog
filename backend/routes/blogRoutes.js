const express = require("express");
const router = express.Router();

const blog = require("../controllers/blogController");
const auth = require("../middleware/authMiddleware");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "inkblog",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });


// =====================
// 🌍 PUBLIC ROUTES
// =====================

router.get("/", blog.getAllBlogs);

// 👇 IMPORTANT: put BEFORE /:id
router.get("/my-blogs", auth, blog.getMyBlogs);

router.get("/:id", blog.getBlogById);


// =====================
// 🔐 PROTECTED ROUTES
// =====================

router.post("/", auth, upload.single("image"), blog.createBlog);

router.put("/:id", auth, upload.single("image"), blog.updateBlog);

router.delete("/:id", auth, blog.deleteBlog);

module.exports = router;