import asyncHandler from "express-async-handler";
import technology_model from "../models/technology_model.js";

// @desc    Get all technologies
// @route   GET /api/technology/get_all
// @access  Private
const get_all = asyncHandler(async (_req, _res) => {
 return _res.send("Get All")
});

// @desc    Add new technology
// @route   POST /api/technology/add
// @access  Private
const add = asyncHandler(async (_req, _res) => {
    return _res.send("Add")
});

// @desc    Update technology
// @route   PUT /api/technology/update
// @access  Private
const update = asyncHandler(async (_req, _res) => {
    return _res.send("Update")
});

// @desc    Delete technology
// @route   DELETE /api/technology/delete
// @access  Private
const delete_ = asyncHandler(async (_req, _res) => {
    return _res.send("Delete")
});

const technology_controller = {
    get_all,
    add,
    update,
    delete_
}
export default technology_controller;