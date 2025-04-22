import {asynchandlers}  from "../utils/asynchandlers.js";
import {Apierror} from "../utils/Apierror.js"
import {User} from "../../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { Apiresponse } from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import path from "path"

const generateAcessAndRefreshTokens = async(userId) => {

    try{

        const user = await User.findById(userId) 
        const acessToken = user.generateAcessToken() 
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken 
        user.save({validateBeforeSave : false })

        return {acessToken , refreshToken} 

    }catch(err){
         throw new Apierror(500 , "something went wrong while generating refresh and acess token")
    }
}

const registerUser = asynchandlers( async (req , res ) => {
  

  const {fullName , email , username , password} = req.body 
//   console.log("email :" , email);
//   console.log("Name :" , username);
 


//   if(fullName === ""){
//     throw new Apierror(400 , "fullname cant be empty")
//   }

if(
    [fullName , email , username , password].some((feild) => (
               feild?.trim() === "" ))
){
    throw new Apierror(400 , "feilds cant be empty all are req ")

}
// console.log(req.files);


// console.log("File path directly:", req.files.avatar[0].path);
// console.log("Current Working Directory:", process.cwd());


const existedUser = await User.findOne({
    $or : [ {username :username.toLowerCase()} ,  {email :email.toLowerCase()} ]
})




if(existedUser){
    throw new Apierror(409 , "user with email or username exist ")
}


const avatarLocalPath =  path.resolve(req.files?.avatar[0]?.path) ; 
//  console.log("avatar path " , avatarLocalPath)


//const coverImageLocalPath = path.resolve(req.files?.coverImage[0]?.path ); 

let coverImageLocalPath ; 
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ){
   
    coverImageLocalPath = req.files.coverImage[0].path 
}


if(!avatarLocalPath) {
    throw new Apierror(400 , "avatar file is required ")
}


// console.log("coverimage" , coverImageLocalPath); 
//  const avatar = await uploadOnCloudinary(avatarLocalPath) 

    
    
    const avatar = await uploadOnCloudinary(avatarLocalPath) 
    // console.log("File URL:", avatar?.url);
//  console.log("avatar URL from cloudinary :", avatar?.url);

const coverImage = await uploadOnCloudinary(coverImageLocalPath) 
//  console.log("coverImage File URL from cloudinary :", coverImage?.url);

if(!avatar){
    throw new Apierror(400 , "avatar file is required ")
}
 
const user = await User.create({
    fullName , 
    avatar : avatar.url , 
    coverImage : coverImage?.url  || "" , 
    email , 
    password , 
    username : username.toLowerCase() 


})

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if(!createdUser) {
    throw new Apierror(500 , "error in registering user ")
}







return res.status(201).json(
    new Apiresponse(200 , createdUser , "   User registered successfully ")
      
)




  
 


})

const loginUser = asynchandlers(async (req ,res) => {
   

    const {email , username , password} = req.body 
    

    // console.log("email" , email)
    if( !(username || email)){

        throw new Apierror(400 , "username or email is required ")
    }

    
    
    const user = await User.findOne({
        $or : [{username} , {email} ]
    })
   
   

   
    

    if(!user){
        throw new Apierror(404 , "user not found ")
    }

    const ispasswordValid = await user.isPasswordCorrect(password)
     
    // console.log("password validation " , ispasswordValid);
     
    if(!ispasswordValid){
        throw new Apierror(401 , "password not valid  ")
    }

   const {acessToken , refreshToken} = await  generateAcessAndRefreshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select(
     "-password -refreshToken"
   )

   const options = {
     httpOnly: true , 
     secure : true 
   }

   return res
   .status(200)
   .cookie("acessToken" , acessToken , options)
   .cookie("refreshToken" , refreshToken , options  )
   .json(
     new Apiresponse(200 , {user : loggedInUser , acessToken , refreshToken } , 
        "user logged in successfully"
     )
   )
       

    


})

const logoutUser = asynchandlers(async(req , res ) =>{

   
    
   await User.findByIdAndUpdate( req.user._id , 
        {
            $set : {
                refreshToken :undefined 

            }
        }, {
            new : true 
        }
    )

    const options = {
        httpOnly: true , 
        secure : true 
      }
    

      return res
      .status(200)
      .clearCookie("acessToken" , options)
      .clearCookie("refreshToken" , options)
      .json(new Apiresponse(200 , {} , "User logged out " ))
   
})


const refreshAcessToken = asynchandlers(async(req ,res) =>{
   const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
    throw new Apierror(401 , "unauthorised request token not same")
   }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
  
   const user = await User.findById(decodedToken?._id)
  
   if(!user){
      throw new Apierror(401 , "invalid user ")
  }
  
  
  if(incomingRefreshToken !== user?.refreshToken){
      throw new  Apierror(401 , "refresh token didint match")
  }
  
   const options = {
      httpOnly : true , 
      secure : true 
   }
  
   const {acessToken , newrefreshToken} = await generateAcessAndRefreshTokens(user._id)
  
   return res
   .status(200)
   .cookie("acessToken" , acessToken , options)
   .cookie("refreshToken" , newrefreshToken , options)
   .json(
      new Apiresponse(
          200 , 
          {
              acessToken , 
             refreshToken : newrefreshToken 
  
          },
          "Acess token refreshed"
      )
   )
  } catch (error) {
    
    throw new Apierror(401 , error?.message || 
        "Invalid refresh Token"
    )
  }





})


export {registerUser , 
       loginUser , 
       logoutUser , 
       refreshAcessToken
} 