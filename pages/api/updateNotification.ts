// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../utils/connectMongo";
import { UserNotification } from "../../models/notificationModal";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { docID: documentID } = req.body;

    if (!documentID) {
      console.log("Not enough information provided.");
      return res
        .status(400)
        .json({ message: "Not enough information provided." });
    }

    try {
      await connectMongo();
      const filter = { docID: documentID };
      const update = { read: true };

      const updatedNoti = await UserNotification.findOneAndUpdate(
        filter,
        update,
        {
          new: true,
        }
      );
      updatedNoti.read;

      if (updatedNoti.read) {
        console.log("Notification Read");

        return res.status(200).json({ message: updatedNoti });
      } else if (!updatedNoti.read) {
        console.log("Error Ocurred");
        return res.status(200).json({ message: "Error Ocurred" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Something went wrong!" });
    }
  } else {
    return res.status(400).json({ message: "Wrong request" });
  }
}
