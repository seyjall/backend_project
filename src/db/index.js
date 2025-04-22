import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{

      const connectionInstance =   await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
      
      // console.log(`Mongodb connected ${connectionInstance.connection.host}`);
      console.log(`Mongodb connected ${connectionInstance.connection.name}`);
      

    }catch(error){
        console.log("MONGODB CONNECTION ERROR " , error);
        process.exit(1)
        
    }
}


export default connectDB