import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


//------not completed 
const getAllVideos = asyncHandler(async(req , res) => {
    const {page = 1 , limit = 10 , query , sortBy , sortType , userId} = req.query 

})

const publishVideo = asyncHandler(async(req , res) =>{
    const {title , description} = req.params 
})

const getVideoById = asyncHandler(async(req , res) =>{
    const {videoId} = req.params
})

const updateVideo = asyncHandler(async(req , res) =>{
    const {videoId} = req.params
})

const deleteVideo = asyncHandler(async(req , res) =>{
    const {videoId} = req.params 
})

const togglePublishStatus = asyncHandler(async(req , res) =>{
    const {videoId} = req.params
})

export {
    getAllVideos , 
    publishVideo , 
    getVideoById , 
    updateVideo , 
    deleteVideo , 
    togglePublishStatus
}