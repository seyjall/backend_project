import {asynchandlers}  from "../utils/asynchandlers.js";
import {Apierror} from "../utils/Apierror.js"
import {User} from "../../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { Apiresponse } from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import path from "path" 
import { Comment } from "../../models/comment.model.js";

const getVideoComments = asynchandlers( async(req , res) =>{
    const {videoId} = req.params 
    const {page = 1, limit = 10} = req.query 

    if(!videoId) {
        throw new Apierror(404 , "VideoId must be sent")
    }

    const comments = await  Comment.findById(videoId) 


})

const addComment = asynchandlers(async (req, res) => {
 

    //user should be logged in 
    //verifyjwt 

    const user = await User.findById(req.user?._id) 

    if(!user){
        throw new Apierror (400 , "User should be logged in")
    }


    const {videoId} = req.params 
    const {content} = req.body 

    if(!content || !videoId){
        throw new Apierror(400 , "Both feilds are required")
    }

    const comment = await Comment.create({
        content : content , 
        video : videoId , 
        owner : user._id
    })

    if(!comment ){
        throw new Apierror(404 , "comment not created in db")
    }


    return res
    .status(200)
    .json(
        new Apiresponse(200 , comment , "comment added successfully")
    )




})

const updateComment = asynchandlers(async (req, res) => {
     
    const user = await User.findById(req.user?._id) 

    if(!user){
        throw new Apierror (400 , "User should be logged in")
    }

    const {commentId} = req.params 

    const {content} = req.body ; 

    if(!videoId || !newContent){
        throw new Apierror(404 , "both videoId and newComment are required")
    }

    const comment = await Comment.findByIdAndUpdate(commentId, 
        { $set : {
            content  
        } } , 
        {new : true }

    )

    if(!comment){
        throw new Apierror(400 , "comment with given ID not found")
    }

    return res
    .status(200)
    .json(
        new Apiresponse(200 , comment , "comment updated successfully ")
    )
        
    


})

const deleteComment = asynchandlers(async (req, res) => {
    
    if (!req.user) {
        throw new ApiError(401, "User must be logged in");
      }
    
    const {commentId} = req.params ; 

    if(!commentId){
        throw new Apierror(404 , "CommentID not valid ")
    }

   await Comment.findByIdAndDelete(commentId ) 


   return res
   .status(200)
   .json(
     new Apiresponse(200 , {} , "Comment deleted successfully")
   )
    
})


export {
    getVideoComments ,
    addComment ,
    updateComment , 
    deleteComment


}