import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../utils/connectMongo";
import { User } from "../../../models/userModel";
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

    if (!data.walletAddress || !data.name) {
      console.log("Not enough information provided.");
      return res
        .status(400)
        .json({ message: "Not enough information provided." });
    }

    try {
      await connectMongo();
      const { walletAddress: address } = req.body;
      const user = await User.findOne({ walletAddress: address });

      if (user) {
        return res.status(200).json({ message: "User already exists" });
      } else if (!user) {
        // Create a new random wallet
        const wallet = EthCrypto.createIdentity();
        const ivStr = process.env.NEXT_PUBLIC_IV!;
        const iv = Buffer.from(ivStr, "hex");
        const passphrase = process.env.NEXT_PUBLIC_PARAPHRASE!;

        // Derive a key and encryption cipher from the passphrase
        const key = crypto.scryptSync(passphrase, "salt", 32);
        const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
        // Encrypt the private key
        let encryptedPrivateKey = cipher.update(
          wallet.privateKey,
          "utf8",
          "hex"
        );

        encryptedPrivateKey += cipher.final("hex");
        const dataToSend = {
          name: data.name,
          walletAddress: address,
          internalWalletAddress: wallet.address,
          publicKey: wallet.publicKey,
          privateKey: encryptedPrivateKey,
        };
        const newUser = new User(dataToSend);
        console.log("User created successfully");
        newUser.save();
        return res.status(200).json({ message: "User created successfully" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Something went wrong!" });
    }
  } else {
    return res.status(400).json({ message: "Wrong request" });
  }
}
