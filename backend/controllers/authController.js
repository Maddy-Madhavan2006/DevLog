const db = require("../config/db");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

// ✅ REGISTER
exports.register = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    // 🔍 CHECK EXISTING USER
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // 💾 INSERT USER
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // 🔍 FIND USER
    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = results[0];

    // 🔐 CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // 🎟️ CREATE TOKEN
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );

    // ✅ SEND RESPONSE
    res.json({
      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};