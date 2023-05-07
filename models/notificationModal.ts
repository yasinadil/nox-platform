import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  name: String,
  walletAddress: {
    type: String,
    required: true,
  },
  recipientWalletAddress: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  read: {
    type: Boolean,
  },
  docID: {
    type: Number,
  },
});
// const User = models.User || mongoose.model("User", notificationSchema);
const UserNotification =
  mongoose.models.userNotifications ||
  mongoose.model("userNotifications", notificationSchema);

export { UserNotification };
