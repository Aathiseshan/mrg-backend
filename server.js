import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST route to send email only
app.post("/api/form", async (req, res) => {
  const { name, email, age, gender, gothram, subCategory, location, whatsapp } =
    req.body;

  try {
    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // or 587 for TLS
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // 16-char Gmail App Password
      },
    });

    // Verify transporter
    await transporter.verify();
    console.log("✅ Mail server is ready to send messages");

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // your Gmail
      subject: "New Marriage Form Submission",
      text: `Name: ${name}
Email: ${email}
Gender: ${gender}
Age: ${age}
Gothram: ${gothram}
Sub Category: ${subCategory}
Location: ${location}
WhatsApp: ${whatsapp}`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Mail sent successfully:", info.response);

    res.status(200).json({ success: true, message: "Mail sent successfully!" });
  } catch (error) {
    console.error("❌ Mail Send Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error sending mail", error });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
