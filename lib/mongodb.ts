// mongodb.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define the connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://10.35.15.166:27017/myDatabase'; 

// Define the interfaces for the documents
export interface IUser extends Document {
  firebaseId: string;
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
  category: 'finance' | 'productivity' | 'ai';
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
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

// Define the schemas for each collection
const UserSchema: Schema = new Schema({
  firebaseId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profileImageUrl: { type: String, required: false },
  isPremium: { type: Boolean, default: false },
  subscriptionPlan: { type: String, required: false },
}, { timestamps: true });

const ToolSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, index: true },
  category: { type: String, enum: ['finance', 'productivity', 'ai'], required: true },
  description: { type: String, required: true },
  premiumOnly: { type: Boolean, default: false },
}, { timestamps: true });

const UsageLogSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toolSlug: { type: String, required: true },
}, { timestamps: true });

const PaymentSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' },
  paymentMethod: { type: String, required: true },
  paymentId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, { timestamps: true });

// Check if models exist to prevent Mongoose from recreating them on hot-reloads
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
const Tool = mongoose.models.Tool || mongoose.model<ITool>('Tool', ToolSchema);
const UsageLog = mongoose.models.UsageLog || mongoose.model<IUsageLog>('UsageLog', UsageLogSchema);
const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

// Connection function
export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  return mongoose.connect(MONGODB_URI);
}

// CRUD Functions for each collection

// Users
export const createUser = async (userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>) => {
  await connectToDatabase();
  const user = new User(userData);
  return user.save();
};

export const findUserByFirebaseId = async (firebaseId: string) => {
  await connectToDatabase();
  return User.findOne({ firebaseId });
};

export const updateUser = async (firebaseId: string, updates: Partial<IUser>) => {
  await connectToDatabase();
  return User.findOneAndUpdate({ firebaseId }, updates, { new: true });
};

// Tools
export const createTool = async (toolData: Omit<ITool, '_id' | 'createdAt' | 'updatedAt'>) => {
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
  return UsageLog.find({ userId }).sort({ usedAt: -1 });
};

// Payments
export const createPayment = async (paymentData: Omit<IPayment, '_id' | 'createdAt'>) => {
  await connectToDatabase();
  const payment = new Payment(paymentData);
  return payment.save();
};

export const getPaymentHistory = async (userId: string) => {
  await connectToDatabase();
  return Payment.find({ userId }).sort({ createdAt: -1 });
};