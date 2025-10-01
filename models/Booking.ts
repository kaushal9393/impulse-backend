import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  total: Number,
  status: { type: String, default: "pending" },
  sampleDate: Date,
  payment: {
    paid: { type: Boolean, default: false },
    provider: String,
    providerPaymentId: String,
  },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
