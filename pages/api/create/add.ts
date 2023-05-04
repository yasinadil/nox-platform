import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../utils/connectMongo";
import { User } from "../../../models/userModel";
import { ethers } from "ethers";
import crypto from "crypto";
import eccrypto from "eccrypto";
import Wallet from "ethereumjs-wallet";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body;
    console.log(data);

    if (!data.walletAddress) {
      console.log("Not enough information provided.");
      return res
        .status(400)
        .json({ message: "Not enough information provided." });
    }

    try {
      await connectMongo();
      const { walletAddress: address } = req.body;
      const { encryptedPublicKey: ePubKey } = req.body;
      const user = await User.findOne({ walletAddress: address });

      if (user) {
        return res.status(200).json({ message: "User already exists" });
      } else if (!user) {
        if (!data.name) {
          console.log("Not enough information provided.");
          return res
            .status(400)
            .json({ message: "Not enough information provided." });
        }

        // Create a new random wallet
        const wallet = ethers.Wallet.createRandom();

        const dataToSend = {
          name: data.name,
          walletAddress: address,
          internalWalletAddress: wallet.address,
          publicKey: ePubKey,
          privateKey: wallet.privateKey,
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

  // const submit = await User.create(req.body);
  // mongoose.connection.close(() => {
  //     console.log('Connection to database closed');
  // });
}
