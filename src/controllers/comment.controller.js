import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    //Validate videoId
    if(!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: {createdAt: -1},
    }

    const comments = await Comment.aggregatePaginate(
        {
            video: new mongoose.Types.ObjectId(videoId),
        }, options
    )

    if (!comments) {
        throw new ApiError(500, "Failed to fetch comments")
    }

    return res.status(200).json(
        new ApiResponse(200, "Comments fetched successfully", {
        })
    )
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }