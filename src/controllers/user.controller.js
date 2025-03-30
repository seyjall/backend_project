import {asynchandlers}  from "../utils/asynchandlers.js";

const registerUser = asynchandlers( async (req , res ) => {
  

    res.status(200).json({
        message : "ok"
    })



})


export {registerUser} 