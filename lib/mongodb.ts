// lib/mongodb.ts
import mongoose, { Schema, Document } from "mongoose";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

const client = new MongoClient(uri, options);
const clientPromise = client.connect();
export default clientPromise;

// ✅ Load MongoDB connection string
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://10.118.170.117:27017/myDatabase"; // fallback for local use

if (!MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI in environment variables.");
}

// ✅ Keep a global connection cache to prevent multiple connections in dev
let isConnected = false;

// ====== INTERFACES ======
export interface IUser extends Document {
  email: string;
  name: string;
  profileImageUrl?: string;
  isPremium: boolean;
  subscriptionPlan?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITool extends Document {
  name: string;
  slug: string;
  category: "finance" | "productivity" | "ai";
  description: string;
  premiumOnly: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUsageLog extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  toolSlug: string;
  usedAt: Date;
}

export interface IPayment extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  plan: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentId: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

// ====== SCHEMAS ======
const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    profileImageUrl: { type: String },
    isPremium: { type: Boolean, default: false },
    subscriptionPlan: { type: String },
  },
  { timestamps: true }
);

const ToolSchema = new Schema<ITool>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      enum: ["finance", "productivity", "ai"],
      required: true,
    },
    description: { type: String, required: true },
    premiumOnly: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UsageLogSchema = new Schema<IUsageLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toolSlug: { type: String, required: true },
  },
  { timestamps: true }
);

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" },
    paymentMethod: { type: String, required: true },
    paymentId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// ====== MODELS ======
export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const Tool =
  mongoose.models.Tool || mongoose.model<ITool>("Tool", ToolSchema);
export const UsageLog =
  mongoose.models.UsageLog ||
  mongoose.model<IUsageLog>("UsageLog", UsageLogSchema);
export const Payment =
  mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", PaymentSchema);

// ====== CONNECTION FUNCTION ======
export async function connectToDatabase() {
  if (isConnected) {
    console.log("⚡ MongoDB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected:", db.connection.host);
  } catch (err: any) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
}

// ====== CRUD FUNCTIONS ======

// Users
export const createUser = async (
  userData: Omit<IUser, "_id" | "createdAt" | "updatedAt">
) => {
  await connectToDatabase();
  const user = new User(userData);
  return user.save();
};

// Tools
export const createTool = async (
  toolData: Omit<ITool, "_id" | "createdAt" | "updatedAt">
) => {
  await connectToDatabase();
  const tool = new Tool(toolData);
  return tool.save();
};

export const findToolBySlug = async (slug: string) => {
  await connectToDatabase();
  return Tool.findOne({ slug });
};

export const getAllTools = async () => {
  await connectToDatabase();
  return Tool.find({});
};

// Usage Logs
export const logToolUsage = async (userId: string, toolSlug: string) => {
  await connectToDatabase();
  const log = new UsageLog({ userId, toolSlug });
  return log.save();
};

export const getUsageLogsByUserId = async (userId: string) => {
  await connectToDatabase();
  return UsageLog.find({ userId }).sort({ createdAt: -1 });
};

// Payments
export const createPayment = async (
  paymentData: Omit<IPayment, "_id" | "createdAt">
) => {
  await connectToDatabase();
  const payment = new Payment(paymentData);
  return payment.save();
};

export const getPaymentHistory = async (userId: string) => {
  await connectToDatabase();
  return Payment.find({ userId }).sort({ createdAt: -1 });
};