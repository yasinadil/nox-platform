import mongoose from 'mongoose';

const connectMongo = async () => {
   
    return mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
}

 

export default connectMongo;


