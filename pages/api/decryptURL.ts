import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../utils/connectMongo";
import { User } from "../../models/userModel";
import { ethers } from "ethers";
const crypto = require("crypto");
const EthCrypto = require("eth-crypto");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body;
    console.log(data);

    if (!data.walletAddress || !data.encryptedURL) {
      console.log("Not enough information provided.");
      return res
        .status(400)
        .json({ message: "Not enough information provided." });
    }

    try {
      await connectMongo();
      const { walletAddress: address } = req.body;
      const { encryptedURL } = req.body;
      const user = await User.findOne({ walletAddress: address });

      if (user) {
        const encryptedPrivateKey = user.privateKey;
        const passphrase = process.env.NEXT_PUBLIC_PARAPHRASE!;
        const key = crypto.scryptSync(passphrase, "salt", 32);
        const ivStr = process.env.NEXT_PUBLIC_IV!;
        const iv = Buffer.from(ivStr, "hex");

        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

        let decryptedPrivateKey = decipher.update(
          encryptedPrivateKey,
          "hex",
          "utf8"
        );
        decryptedPrivateKey += decipher.final("utf8");

        const decrypted = await EthCrypto.decryptWithPrivateKey(
          decryptedPrivateKey,
          JSON.parse(encryptedURL)
        );
        console.log(decrypted);

        return res.status(200).json({ message: decrypted });
      } else if (!user) {
        return res.status(400).json({ message: "User Not Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Something went wrong!" });
    }
  } else {
    return res.status(400).json({ message: "Wrong request" });
  }
}
