import mongoose, { Schema, Document, model } from "mongoose";

export interface IReport extends Document {
  booking: mongoose.Types.ObjectId;
  fileUrl: string;
  notes?: string;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    fileUrl: { type: String, required: true },
    notes: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Report || model<IReport>("Report", ReportSchema);