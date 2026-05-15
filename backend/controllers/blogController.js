const db = require("../config/db");

// ✅ GET ALL BLOGS
exports.getAllBlogs = async (req, res) => {
  try {
    const [blogs] = await db.query(`
      SELECT 
        blogs.*,
        users.name AS author
      FROM blogs
      JOIN users
      ON blogs.user_id = users.id
      ORDER BY blogs.created_at DESC
    `);

    res.json(blogs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ GET SINGLE BLOG
exports.getBlogById = async (req, res) => {
  try {
    const [result] = await db.query(
      `
      SELECT 
        blogs.*,
        users.name AS author
      FROM blogs
      JOIN users
      ON blogs.user_id = users.id
      WHERE blogs.id = ?
      `,
      [req.params.id],
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.json(result[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ CREATE BLOG

// ✅ GET ALL BLOGS
exports.getAllBlogs = async (req, res) => {
  try {
    const [blogs] = await db.query(`
      SELECT 
        blogs.*,
        users.name AS author
      FROM blogs
      JOIN users
      ON blogs.user_id = users.id
      ORDER BY blogs.created_at DESC
    `);

    res.json(blogs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ GET SINGLE BLOG
exports.getBlogById = async (req, res) => {
  try {
    const [result] = await db.query(
      `
      SELECT 
        blogs.*,
        users.name AS author
      FROM blogs
      JOIN users
      ON blogs.user_id = users.id
      WHERE blogs.id = ?
      `,
      [req.params.id],
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.json(result[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ CREATE BLOG
exports.createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const user_id = req.user.id;

    // 🔥 CLOUDINARY IMAGE URL
    const image = req.file ? req.file.path : "";

    const [result] = await db.query(
      `
      INSERT INTO blogs
      (title, content, image, category, user_id)
      VALUES (?, ?, ?, ?, ?)
      `,
      [title, content, image, category, user_id],
    );

    res.status(201).json({
      message: "Blog created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ UPDATE BLOG
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // 🔥 STEP 1: get existing image first
    const [rows] = await db.query(
      "SELECT image FROM blogs WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    let image = rows[0].image; // keep old image by default

    // 🔥 STEP 2: override only if new file uploaded
    if (req.file) {
      image = req.file.path;
    }

    // 🔥 STEP 3: update safely
    const [result] = await db.query(
      `
      UPDATE blogs
      SET title = ?, content = ?, image = ?, category = ?
      WHERE id = ? AND user_id = ?
      `,
      [title, content, image, category, req.params.id, req.user.id],
    );

    res.json({
      message: "Blog updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const [result] = await db.query(
      `
      DELETE FROM blogs
      WHERE id = ?
      AND user_id = ?
      `,
      [req.params.id, req.user.id],
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({
        message: "Unauthorized or blog not found",
      });
    }

    res.json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ GET LOGGED USER BLOGS
exports.getMyBlogs = async (req, res) => {
  try {
    const [blogs] = await db.query(
      `
      SELECT *
      FROM blogs
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [req.user.id],
    );

    res.json(blogs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ UPDATE BLOG
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // 🔥 STEP 1: get existing image first
    const [rows] = await db.query(
      "SELECT image FROM blogs WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    let image = rows[0].image; // keep old image by default

    // 🔥 STEP 2: override only if new file uploaded
    if (req.file) {
      image = req.file.path;
    }

    // 🔥 STEP 3: update safely
    const [result] = await db.query(
      `
      UPDATE blogs
      SET title = ?, content = ?, image = ?, category = ?
      WHERE id = ? AND user_id = ?
      `,
      [
        title,
        content,
        image,
        category,
        req.params.id,
        req.user.id,
      ]
    );

    res.json({
      message: "Blog updated successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const [result] = await db.query(
      `
      DELETE FROM blogs
      WHERE id = ?
      AND user_id = ?
      `,
      [req.params.id, req.user.id],
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({
        message: "Unauthorized or blog not found",
      });
    }

    res.json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ GET LOGGED USER BLOGS
exports.getMyBlogs = async (req, res) => {
  try {
    const [blogs] = await db.query(
      `
      SELECT *
      FROM blogs
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [req.user.id],
    );

    res.json(blogs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
