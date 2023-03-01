import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from "../../../utils/connectMongo";
import {User} from "../../../models/userModel";
import { ethers } from 'ethers';
import crypto from "crypto";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
   
        if(req.method === "POST"){
            const data = req.body;
            
        if(!data.walletAddress){
            console.log("Not enough information provided.");
            return res.status(400).json({message:"Not enough information provided."});
        }

        try {
            await connectMongo();
            const {walletAddress: address} = req.body;
            const user = await User.findOne({ walletAddress: address });
         
                if (user) {
                  return res.status(200).json({message: "User already exists"});
                } else if(!user) {
                  if(!data.name){
                    console.log("Not enough information provided.");
                    return res.status(400).json({message:"Not enough information provided."});
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
                  let ciphertextString;
                  if(key != undefined){
                    ciphertextString = handleEncrypt(plaintext, key)
                  }
                  
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
                  return res.status(200).json({message: "User created successfully"});
                }
        } catch (error) {

            console.log(error);
   
            
            return res.status(400).json({message:"Something went wrong!"});
        }
        }
        else{
          return res.status(400).json({message: "Wrong request"});
        }
        
        
 
        
        
        
        // const submit = await User.create(req.body);
        // mongoose.connection.close(() => {
        //     console.log('Connection to database closed');
        // });
   
}