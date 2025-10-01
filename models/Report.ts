import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  fileUrl: String,
  notes: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
