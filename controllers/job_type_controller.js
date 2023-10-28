import asyncHandler from "express-async-handler";
import job_type_model from "../models/job_type_model.js";

// @desc    Get all job types
// @route   GET /api/job_type/get_all
// @access  Private
const get_all = asyncHandler(async (_req, _res) => {
    return _res.send("Get All");
});

// @desc    Add new job type
// @route   POST /api/job_type/add
// @access  Private
const add = asyncHandler(async (_req, _res) => {
    return _res.send("Add");
});

// @desc    Get job type by job type id
// @route   GET /api/job_type/get/:job_type_id
// @access  Private
const get_by_job_type_id = asyncHandler(async (_req, _res) => {
    return _res.send("Get By Job Type Id");
});

// @desc    Update job type by job type id
// @route   PUT /api/job_type/update/:job_type_id
// @access  Private
const update = asyncHandler(async (_req, _res) => {
    return _res.send("Update");
});

// @desc    Delete job type by job type id
// @route   DELETE /api/job_type/delete/:job_type_id
// @access  Private
const delete_ = asyncHandler(async (_req, _res) => {
    return _res.send("Delete");
});

// @desc    Get job type by job id
// @route   GET /api/job_type/get_by_job/:job_id
// @access  Private
const get_by_job_id = asyncHandler(async (_req, _res) => {
    return _res.send("Get By Job Id");
});

export default {
    get_all,
    add,
    get_by_job_type_id,
    update,
    delete_,
    get_by_job_id,
};