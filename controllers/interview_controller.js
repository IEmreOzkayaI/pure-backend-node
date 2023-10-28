import asyncHandler from "express-async-handler";
import interview_model from "../models/interviewModels/interview_model.js";
import interview_result_model from "../models/interviewModels/interview_result_model.js";

// @desc    Get all interviews
// @route   GET /api/interview/get_all
// @access  Private
const get_all = asyncHandler(async (_req, _res) => {
	return _res.send("Get All");
});

// @desc    Add new interview
// @route   POST /api/interview/add
// @access  Private
const add = asyncHandler(async (_req, _res) => {
	return _res.send("Add");
});

// @desc    Get interview by interview id
// @route   GET /api/interview/get/:interview_id
// @access  Private
const get_by_interview_id = asyncHandler(async (_req, _res) => {
	return _res.send("Get By Interview Id");
});

// @desc    Update interview by interview id
// @route   PUT /api/interview/update/:interview_id
// @access  Private
const update = asyncHandler(async (_req, _res) => {
	return _res.send("Update");
});

// @desc    Delete interview by interview id
// @route   DELETE /api/interview/delete/:interview_id
// @access  Private
const delete_ = asyncHandler(async (_req, _res) => {
	return _res.send("Delete");
});

//@desc Get all interview results
//@route GET /api/interview/get_all_result
//@access Private
const get_all_result = asyncHandler(async (_req, _res) => {
	return _res.send("Get All Result");
});

//@desc Add new interview result
//@route POST /api/interview/add_result
//@access Private
const add_result = asyncHandler(async (_req, _res) => {
	return _res.send("Add Result");
});

//@desc Get interview result by interview result id
//@route GET /api/interview/get_result/:interview_result_id
//@access Private
const get_by_interview_result_id = asyncHandler(async (_req, _res) => {
    return _res.send("Get By Interview Result Id");
});

//@desc Update interview result by interview result id
//@route PUT /api/interview/update_result/:interview_result_id
//@access Private
const update_result = asyncHandler(async (_req, _res) => {
    return _res.send("Update Result");
});

//@desc Delete interview result by interview result id
//@route DELETE /api/interview/delete_result/:interview_result_id
//@access Private
const delete_result = asyncHandler(async (_req, _res) => {
    return _res.send("Delete Result");
});

//@desc Get interview result by user id
//@route GET /api/interview/get_result/:user_id
//@access Private
const get_by_user_id = asyncHandler(async (_req, _res) => {
    return _res.send("Get By User Id");
});

export default {
    get_all,
    add,
    get_by_interview_id,
    update,
    delete_,
    get_all_result,
    add_result,
    get_by_interview_result_id,
    update_result,
    delete_result,
    get_by_user_id,
};

