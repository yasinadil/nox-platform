import mongoose from 'mongoose';

const connectMongo = async () => {
   console.log(process.env.NEXT_PUBLIC_MONGO_URL!);
   
    return mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URL!);
      
}

export default connectMongo;