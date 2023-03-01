// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from "/utils/connectMongo";
import {User} from "/models/userModel";
import mongoose from 'mongoose';
import { ethers } from 'ethers';
import crypto from "crypto";

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
   
        if(req.method === "POST"){
            const data = req.body;
            
        if(!data.walletAddress){
            console.log("Not enough information provided.");
            res.status(400).json({message:"Not enough information provided."});
        }

        try {
            const connection = await connectMongo();
            const {walletAddress: address} = req.body;
            const user = await User.findOne({ walletAddress: address });
         
                if (user) {
                  console.log(user);
                  res.status(200).json({message: "User already exists"});
                } else if(!user) {
                  if(!data.name){
                    console.log("Not enough information provided.");
                    res.status(400).json({message:"Not enough information provided."});
                }
                  //create his internal wallet
                  const wallet = ethers.Wallet.createRandom();
                  let plaintext = wallet.privateKey;
                  let key = process.env.NEXT_PUBLIC_ENCKEY;
                  const handleEncrypt = (message: string, secretKey: string) => {
                    const cipher = crypto.createCipher("aes-256-cbc", secretKey);
                    let encrypted = cipher.update(message, "utf-8", "hex");
                    encrypted += cipher.final("hex");
                    return encrypted;
                  };
                  const ciphertextString = handleEncrypt(plaintext, key)
                  const dataToSend = {
                    name: data.name,
                    walletAddress: address,
                    internalWalletAddress: wallet.address,
                    publicKey: wallet.publicKey,
                    privateKey: ciphertextString
                  }
                  const newUser = new User(dataToSend)
                  console.log("User not found");
                  newUser.save();
                }
              
            res.status(200).json({message: "connected"});
        } catch (error) {

            console.log(error);
            console.log(error);
            
            res.status(400).json({message:"Something went wrong!"});
        }
        }
        else{
            res.status(400).json({message: "Wrong request"});
        }
        
        
 
        
        
        
        // const submit = await User.create(req.body);
        // mongoose.connection.close(() => {
        //     console.log('Connection to database closed');
        // });
   
}