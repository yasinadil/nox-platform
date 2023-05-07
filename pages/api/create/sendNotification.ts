import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../utils/connectMongo";
import { User } from "../../../models/userModel";
import { UserNotification } from "../../../models/notificationModal";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body;
    console.log(data);

    if (!data.walletAddress || !data.recipientWalletAddress) {
      console.log("Not enough information provided.");
      return res
        .status(400)
        .json({ message: "Not enough information provided." });
    }

    try {
      await connectMongo();
      const { walletAddress: address } = req.body;
      const { recipientWalletAddress: recepient } = req.body;
      const { docID: documentID } = req.body;
      const user = await User.findOne({ walletAddress: address });

      const dataToSend = {
        name: "Issued",
        walletAddress: address,
        recipientWalletAddress: recepient,
        message: `${user.name} has issued a document to your wallet. Click to check it out!`,
        createdAt: Date.now(),
        read: false,
        docID: documentID,
      };
      const newNotification = new UserNotification(dataToSend);
      console.log("Notification Sent!");
      newNotification.save();
      return res.status(200).json({ message: "Notification Sent" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error });
    }
  } else {
    return res.status(400).json({ message: "Wrong request" });
  }
}
