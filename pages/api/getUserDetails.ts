// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from "../../utils/connectMongo";
import {User} from "../../models/userModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
   
        if(req.method === "POST"){
            const { walletAddress: address } = req.body;
            
        if(!address){
            console.log("Not enough information provided.");
            return res.status(400).json({message:"Not enough information provided."});
        }

        try {
            await connectMongo();
            const user = await User.findOne({ walletAddress: address });
         
                if (user) {
                  return res.status(200).json({message: user});
                } else if(!user) {
                  console.log("User not found");
                  return res.status(200).json({message: "User not found"});
                }
              
           
        } catch (error) {

            console.log(error);
            return res.status(400).json({message:"Something went wrong!"});
        }
        }
        else{
          return res.status(400).json({message: "Wrong request"});
        }
}