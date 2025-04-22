import { asynchandlers } from "../utils/asynchandlers.js";
import { Apierror } from "../utils/Apierror.js";
import jwt from "jsonwebtoken"
import { User } from "../../models/user.model.js";
export const verifyJWT = asynchandlers(async(req ,_, next ) => {

  
    

  try {
     const token =  req.cookies?.acessToken || req.header("Authorization")?.replace("Bearer" , "")
     
      
     if(!token){
       throw new Apierror(401 , "no token generated ")
     }
  
    const decodedToken =  jwt.verify(token , process.env.ACESS_TOKEN_SECRET)
    
 
        const user = await User.findById(decodedToken?._id).select(
            "-password  -refreshToken"
          )
          console.log(user);
          
  
    
  

    
  
    if(!user){
        throw new Apierror(401 , "invalid acess token")
    }
  
    req.user = user ; 
   
    
    next()
  } catch (error) {

    throw new Apierror(401 , error?.message || "invalid acess token")
    
  }
  


})