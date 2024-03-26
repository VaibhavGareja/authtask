const express = require("express");
const router = express.Router();
const User = require("../model/User");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const transporter = require("../helper/email");
const verifyToken = require("../middleware/auth");

router.post("/signup", async (req, res) => {
  try {
    const existingUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        status: 0,
        message: "User already exists",
      });
    }
    const newUser = await User.create(req.body);
    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRATE, {
      expiresIn: "1h",
    });
    newUser.update({ emailToken: token });
    const mailOptions = {
      from: "gvkstudy1010@gmail.com",
      to: newUser.email,
      subject: "Email Verification",
      html: `<p>Click <a href="http://localhost:5173/verify/${token}">here</a> to verify your email address.</p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ status: 0, message: "Error sending email" });
      }
      console.log("Email sent:", info.response);
      return res.status(200).json({
        status: 1,
        message: "User created successfully. Verification email sent.",
      });
    });
    res
      .status(200)
      .json({ status: 1, message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
});

router.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRATE);

    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      return res.status(400).json({ status: 0, message: "User not found" });
    }

    if (user.isVerify) {
      console.error("Email already verified");
      return res
        .status(400)
        .json({ status: 0, message: "Email already verified" });
    }

    console.log(`User ${user.email} has been verified`);
    await user.update({ isVerify: true });
    const updatedUser = await User.findOne({ where: { email: decoded.email } });
    res.json({
      status: 1,
      message: "Email verified",
      isVerified: updatedUser.isVerify,
    });
  } catch (error) {
    res.status(400).json({ status: 0, message: "Error verifying email" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerify) {
      return res.status(400).json({
        message: "Please verify your email before accessing the dashboard",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Incorrect email or password",
      });
    }

    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_SECRATE,
      { expiresIn: process.env.EXPIRE }
    );

    res.status(200).json({
      status: 1,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        isVerify: user.isVerify,
      },
      token: token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ status: 0, message: "Internal Server Error" });
  }
});

router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user.id,
      Fname: user.Fname,
      Lname: user.Lname,
      email: user.email,
      phoneno: user.phoneno,
      DOB: user.DOB,
      photo: user.photo,
      isVerify: user.isVerify,
    });
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/upload-photo", verifyToken, async (req, res) => {
  try {
    const { fileUrl } = req.body;

    // Check if fileUrl is provided
    if (!fileUrl) {
      return res.status(400).json({ message: "No file URL provided" });
    }

    // Find the authenticated user
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's photo field with the new URL
    user.photo = fileUrl;
    await user.save();

    return res.status(200).json({ message: "Photo uploaded successfully" });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/reset-password", verifyToken, async (req, res) => {
  try {
    const { newPassword } = req.body;
    console.log("Reset Password Request Body:", req.body);
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if new password is same as old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({ message: "New password must be different from old password" });
    }

    // Hash the new password and update user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRATE, {
      expiresIn: process.env.EXPIRE,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="http://localhost:5173/reset-password/${token}">here</a> to reset your password.</p>
      `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email" });
      }
      console.log("Email sent:", info.response);
      res
        .status(200)
        .json({ message: "Password reset link sent successfully" });
    });

    res.status(200).json({ message: "Password reset link sent successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
