// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../utils/connectMongo";
import { UserNotification } from "../../models/notificationModal";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { walletAddress: address } = req.body;

    if (!address) {
      console.log("Not enough information provided.");
      return res
        .status(400)
        .json({ message: "Not enough information provided." });
    }

    try {
      await connectMongo();
      const notifications = await UserNotification.find({
        walletAddress: address,
      });

      if (notifications) {
        console.log("Notifications Found");

        return res.status(200).json({ message: notifications });
      } else if (!notifications) {
        console.log("No Notifications Found");
        return res.status(200).json({ message: "No Notifications Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Something went wrong!" });
    }
  } else {
    return res.status(400).json({ message: "Wrong request" });
  }
}
