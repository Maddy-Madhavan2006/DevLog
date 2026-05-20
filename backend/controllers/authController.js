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

  console.log(req.body);

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

    // 🔢 GENERATE OTP
    const otp = generateOtp();

    // ⏰ OTP EXPIRES IN 5 MINUTES
    const otpExpiry = new Date(
      Date.now() + 5 * 60 * 1000
    );

    // 💾 INSERT USER
    await db.query(

      `
      INSERT INTO users
      (
        name,
        email,
        password,
        otp,
        otp_expiry,
        is_verified
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,

      [
        name,
        email,
        hashedPassword,
        otp,
        otpExpiry,
        false,
      ]
    );
    console.log("ABOUT TO SEND OTP");
    console.log(email);
    console.log(otp);
    // 📧 SEND OTP EMAIL
    await resend.emails.send({

      from: "onboarding@resend.dev",

      to: email,

      subject: "DEVLOG Email Verification",

      html: `
        <div>
          <h1>DEVLOG OTP</h1>

          <h2>${otp}</h2>

          <p>
            This OTP expires in 5 minutes.
          </p>
        </div>
      `,
    });

    // ✅ RESPONSE
    res.status(201).json({

      message: "OTP sent successfully",

      email,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
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