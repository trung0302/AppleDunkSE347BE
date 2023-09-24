import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
  } = process.env;
  
try{
    const MONGODB_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}/${MONGO_DB}?retryWrites=true&w=majority`
    // mongoose.connect(MONGODB_URL)
    mongoose.connect(process.env.MONGODB_URL)
}
catch(e){
    console.log(e);
}
mongoose.set('strictQuery', true);
