const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username:{
    type: String,
  },
  productName:{
    type: String,
  },
  date: {
    type: Date, // Only the date portion
    required: true,
  },
  time: {
    type: String, // Store time as a string (e.g., "14:30")
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
