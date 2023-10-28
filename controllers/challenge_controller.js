import asyncHandler from "express-async-handler";
import challenge_model from "../models/challengeModels/challenge_model.js";
import challenge_result_model from "../models/challengeModels/challenge_result_model.js";

// @desc    Get all challenges
// @route   GET /api/challenge/get_all
// @access  Private
const get_all = asyncHandler(async (_req, _res) => {
	return _res.send("Get All");
});

// @desc    Add new challenge
// @route   POST /api/challenge/add
// @access  Private
const add = asyncHandler(async (_req, _res) => {
	return _res.send("Add");
});

// @desc    Get challenge by challenge id
// @route   GET /api/challenge/get/:challenge_id
// @access  Private
const get_by_challenge_id = asyncHandler(async (_req, _res) => {
	return _res.send("Get By Challenge Id");
});

// @desc    Update challenge by challenge id
// @route   PUT /api/challenge/update/:challenge_id
// @access  Private
const update = asyncHandler(async (_req, _res) => {
	return _res.send("Update");
});

// @desc    Delete challenge by challenge id
// @route   DELETE /api/challenge/delete/:challenge_id
// @access  Private
const delete_ = asyncHandler(async (_req, _res) => {
	return _res.send("Delete");
});

//@desc Get all challenge results
//@route GET /api/challenge/get_all_result
//@access Private
const get_all_result = asyncHandler(async (_req, _res) => {
	return _res.send("Get All Result");
});

//@desc Add new challenge result
//@route POST /api/challenge/add_result
//@access Private
const add_result = asyncHandler(async (_req, _res) => {
	return _res.send("Add Result");
});

//@desc Get challenge result by challenge result id
//@route GET /api/challenge/get_result/:challenge_result_id
//@access Private
const get_by_challenge_result_id = asyncHandler(async (_req, _res) => {
	return _res.send("Get By Challenge Result Id");
});

//@desc Update challenge result by challenge result id
//@route PUT /api/challenge/update_result/:challenge_result_id
//@access Private
const update_result = asyncHandler(async (_req, _res) => {
	return _res.send("Update Result");
});

//@desc Delete challenge result by challenge result id
//@route DELETE /api/challenge/delete_result/:challenge_result_id
//@access Private
const delete_result = asyncHandler(async (_req, _res) => {
	return _res.send("Delete Result");
});

//@desc Get challenge result by user id
//@route GET /api/challenge/get_result/:user_id
//@access Private
const get_by_user_id = asyncHandler(async (_req, _res) => {
	return _res.send("Get By User Id");
});

export default {
	get_all,
	add,
	get_by_challenge_id,
	update,
	delete_,
	get_by_user_id,
	get_all_result,
	add_result,
	get_by_challenge_result_id,
	update_result,
	delete_result,
};
