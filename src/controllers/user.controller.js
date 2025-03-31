import {asynchandlers}  from "../utils/asynchandlers.js";
import {Apierror} from "../utils/Apierror.js"
import {User} from "../../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { Apiresponse } from "../utils/Apiresponse.js";
const registerUser = asynchandlers( async (req , res ) => {
  

  const {fullName , email , username , password} = req.body 
  console.log("email :" , email);

//   if(fullName === ""){
//     throw new Apierror(400 , "fullname cant be empty")
//   }

if(
    [fullName , email , username , password].some((feild) => (
               feild?.trim() === "" ))
){
    throw new Apierror(400 , "feilds cant be empty all are req ")

}

const existedUser = User.findOne({
    $or : [ {username} ,  {email} ]
})

if(existedUser){
    throw new Apierror(409 , "user with email or username exist ")
}

const avatarLocalPath =  req.files?.avatar[0]?.path ; 
const coverImageLocalPath = req.files?.coverImage[0]?.path ; 

if(!avatarLocalPath) {
    throw new Apierror(400 , "avatar file is required ")
}

 const avatar = await uploadOnCloudinary(avatarLocalPath) 

const coverImage = await uploadOnCloudinary(coverImageLocalPath) 

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


export {registerUser} 