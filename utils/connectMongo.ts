import mongoose from 'mongoose';

const connectMongo = async () => {
   
    return mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URL!);
      
}

export default connectMongo;