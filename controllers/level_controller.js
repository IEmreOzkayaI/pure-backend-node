import asyncHandler from "express-async-handler";
import level_model from "../models/level_model.js";

// @desc    Get all levels
// @route   GET /api/level/get_all
// @access  Private
const get_all = asyncHandler(async (_req, _res) => {
    return _res.send("Get All");
});

// @desc    Add new level
// @route   POST /api/level/add
// @access  Private
const add = asyncHandler(async (_req, _res) => {
    return _res.send("Add");
});

// @desc    Get level by level id
// @route   GET /api/level/get/:level_id
// @access  Private
const get_by_level_id = asyncHandler(async (_req, _res) => {
    return _res.send("Get By Level Id");
});

// @desc    Update level by level id
// @route   PUT /api/level/update/:level_id
// @access  Private
const update = asyncHandler(async (_req, _res) => {
    return _res.send("Update");
});

// @desc    Delete level by level id
// @route   DELETE /api/level/delete/:level_id
// @access  Private
const delete_ = asyncHandler(async (_req, _res) => {
    return _res.send("Delete");
});

// @desc    Get level by question id
// @route   GET /api/level/get_by_question/:question_id
// @access  Private
const get_by_question_id = asyncHandler(async (_req, _res) => {
    return _res.send("Get By Question Id");
});

export default {
    get_all,
    add,
    get_by_level_id,
    update,
    delete_,
    get_by_question_id,
};