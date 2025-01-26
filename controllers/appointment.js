const Appointment = require("../models/appointement.model.js");
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // or 587 for TLS
  secure: true, // true for port 465, false for port 587
  service: 'gmail', // Use Gmail as the service (or your preferred email provider)
  auth: {
    user: 'aayushjain1290@gmail.com', // Your email address
    pass: 'jpdzvxmwrnfcymfx', 
  },
});
const availableSlots = async(req,res)=>{
       try {
    const { date } = req.query;
    const selectedDate = new Date(date);

    // Fetch appointments for the given date
    const takenSlots = await Appointment.find({ date: selectedDate }).select("time");

    const allSlots = [
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
    ];
    const availableSlots = allSlots.filter(slot => 
      !takenSlots.some(appt => appt.time === slot)
    );

    res.status(200).json({ availableSlots });
  } catch (error) {
    res.status(500).json({ message: "Error fetching slots", error });
  }
}

const bookSlot = async(req,res)=>{
    console.log("Booking slot");
    try {
    const {slot, date,username,userId,usermail,productId,productName } = req.body;
    console.log("check2",slot,date);
    console.log("Booking slot:", { userId, date, slot });
    // Check if the slot is already booked
    const existingAppointment = await Appointment.findOne({ date, time: slot });
    if (existingAppointment) {
      return res.status(400).json({ message: "Slot already booked" });
    }
    const appointment = new Appointment({ user: userId, date, time: slot,username,product:productId,productName});
    const savedAppointment = await appointment.save();
    if(savedAppointment){
      // Send order confirmation email
      const mailOptions = {
        from: 'aayushjain1290@gmail.com', // Sender email
        to: usermail,                     // Recipient email
        subject: 'Successful booking',
         html: `
          <p>Dear ${username},</p>
          <p>We are delighted to confirm that your payment was successful
</p>
        `, // Email body content
      };
      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    console.log("Error booking appointment:", error)
    res.status(500).json({ message: "Error booking appointment", error });
  }
}

const adminSlot = async(req,res)=>{
  try {
    const bookings = await Appointment.find().populate("user", "name email"); // Assuming User model has `name` and `email`
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
}

const updateStatus = async(req,res)=>{
  try {
    const { id } = req.params;
    const { status } = req.body;

    // extra check
    const validStatuses = ["Pending", "Cancelled", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedBooking = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking status updated", updatedBooking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking status", error });
  }
}
const userAppointment = async(req,res)=>{
    try {
        const appointments = await Appointment.find({user:req.params.id});
        return res.status(200).json({appointments})
    } catch (error) {
        console.log("error getting appointments",error);
        res.status(500).json({ message: "Failed to retrieve appointments", error });
    }
};
module.exports = {
    availableSlots,
    bookSlot,
    adminSlot,
    updateStatus,
    userAppointment,
};