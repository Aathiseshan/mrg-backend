import express from "express";
import Form from "../models/FormModel.js";
import { sendMail } from "../mail.js"; // Make sure this file exists and exports sendMail

const router = express.Router();

// POST route to submit form
router.post("/api/form", async (req, res) => {
  try {
    const formData = req.body;

    // Save form data to MongoDB
    const newForm = new Form(formData);
    await newForm.save();
    console.log("✅ Data saved in MongoDB:", newForm);

    // Send email
    await sendMail(formData);

    res.status(200).json({ message: "Form submitted and email sent!" });
  } catch (error) {
    console.error("❌ Form Submit Error:", error);
    res.status(500).json({ message: "Error submitting form", error });
  }
});

// GET route to fetch all forms
router.get("/api/form-data", async (req, res) => {
  try {
    const data = await Form.find(); // consistent with imported model
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

export default router;
