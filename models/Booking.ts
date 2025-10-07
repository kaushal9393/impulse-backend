import mongoose, { Schema, Document, model } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  service: string;
  subTests: string[];
  date: Date;
  status: string;
}

const BookingSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: String, required: true },
  subTests: [{ type: String, required: true }],
  date: { type: Date, required: true },
  status: { type: String, default: "Pending" },
});

export default mongoose.models.Booking || model<IBooking>("Booking", BookingSchema);