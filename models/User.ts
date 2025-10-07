import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  provider: { type: String, default: "local" },
  providerId: { type: String },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
