const db = require("../config/db");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { Resend } = require("resend");

const generateOtp = require("../utils/generateOtp");

const resend = new Resend(
  process.env.RESEND_API_KEY
);


// ✅ REGISTER
exports.register = async (req, res) => {
  console.log("📥 REGISTER HIT:", req.body);

  try {
    const { name, email, password } = req.body;

    // 🔴 BASIC VALIDATION
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // 🔍 CHECK USER EXISTS
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
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔢 GENERATE OTP
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    console.log("🔢 OTP GENERATED:", otp);

    // 💾 INSERT USER
    await db.query(
      `INSERT INTO users (name, email, password, otp, otp_expiry, is_verified)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, otp, otpExpiry, false]
    );

    console.log("💾 USER STORED IN DB");

    // 📧 SEND EMAIL (WITH FULL DEBUG)
    console.log("📧 SENDING EMAIL TO:", email);

    const emailResponse = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: "DEVLOG Email Verification",
      html: `
        <h1>DEVLOG OTP</h1>
        <h2>${otp}</h2>
        <p>Expires in 5 minutes</p>
      `,
    });

    console.log("📧 RESEND RESPONSE:", emailResponse);

    // ❗ CHECK RESEND RESPONSE
    if (!emailResponse || emailResponse.error) {
      console.error("❌ EMAIL FAILED:", emailResponse);

      return res.status(500).json({
        message: "OTP email failed to send",
        error: emailResponse,
      });
    }

    // ✅ SUCCESS
    return res.status(201).json({
      message: "OTP sent successfully",
      email,
    });

  } catch (error) {
    console.error("🔥 REGISTER ERROR FULL:", error);

    return res.status(500).json({
      message: "Server error",
      error: error?.message || error,
    });
  }
};


// ✅ VERIFY OTP
exports.verifyOtp = async (req, res) => {

  try {

    const { email, otp } = req.body;

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

    // ❌ INVALID OTP
    if (user.otp !== otp) {

      return res.status(400).json({
        message: "Invalid OTP",
      });

    }

    // ⏰ OTP EXPIRED
    if (
      new Date(user.otp_expiry) < new Date()
    ) {

      return res.status(400).json({
        message: "OTP expired",
      });

    }

    // ✅ VERIFY USER
    await db.query(

      `
      UPDATE users
      SET
        is_verified = true,
        otp = NULL,
        otp_expiry = NULL
      WHERE email = ?
      `,

      [email]
    );

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

    // ✅ RESPONSE
    res.json({

      message: "Account verified successfully",

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

    // ❌ EMAIL NOT VERIFIED
    if (!user.is_verified) {

      return res.status(401).json({
        message: "Please verify your email first",
      });

    }

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

    // ✅ RESPONSE
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