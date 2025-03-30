//require('dotenv').config({path : './env'}) to keep consistent use import 

import dotenv from "dotenv"
import {app} from './app.js'

dotenv.config({
    path : './env'
})

import mongoose from "mongoose" 
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`server is running at port ${
            process.env.PORT
        }`);
        
    })
})
.catch((err) => {
    console.log("MOGO DB CONNECTION FAILED " , err);
    
})















//1st approach 
//IIFE
// import express from "esxpress"
// const app = express() 
// ;import { DB_NAME } from "./constants";
// ( async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error" , (error) => {
//             console.log("err " , error);
//             throw error 
            
//         })

//         app.listen(process.loadEnvFile.PORT , () => {
//             console.log(`app is listening on port ${process.env.PORT}`);
            
//         })
//     }catch(error){
//         console.error("ERROR : " , error )
//         throw error 
//     }

// })()