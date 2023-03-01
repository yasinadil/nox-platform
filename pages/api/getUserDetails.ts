// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from "/utils/connectMongo";
import {User} from "/models/userModel";
import mongoose from 'mongoose';
import { ethers } from 'ethers';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
   
        if(req.method === "POST"){
            const { walletAddress: address } = req.body;
            
        if(!address){
            console.log("Not enough information provided.");
            res.status(400).json({message:"Not enough information provided."});
        }

        try {
            const connection = await connectMongo();
            
            const user = await User.findOne({ walletAddress: address });
         
                if (user) {
                  res.status(200).json({message: user});
                } else if(!user) {
                  console.log("User not found");
                  res.status(200).json({message: "User not found"});
                }
              
           
        } catch (error) {

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