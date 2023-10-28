import asyncHandler from "express-async-handler";
import documentation_question_model from "../../models/questionModels/documentation_question_model.js";
import documentation_question_result_model from "../../models/questionModels/documentation_question_result_model.js";

import algorithm_question_model from "../../models/questionModels/algorithm_question_model.js";
import algorithm_question_result_model from "../../models/questionModels/algorithm_question_result_model.js";

import diagram_question_model from "../../models/questionModels/diagram_question_model.js";
import diagram_question_result_model from "../../models/questionModels/diagram_question_result_model.js";

import test_question_model from "../../models/questionModels/test_question_model.js";
import test_question_result_model from "../../models/questionModels/test_question_result_model.js";

// @desc    Add new question
// @route   POST /api/question/add
// @access  Private
const add = asyncHandler(async (_req, _res) => {
	return _res.send("Add Question");
});

// @desc    Update  question
// @route   PUT /api/question/update/:question_id
// @access  Private
const update = asyncHandler(async (_req, _res) => {
	return _res.send("Update Question");
});

// @desc    Get all  questions
// @route   GET /api/question/get_all
// @access  Private
const get_all = asyncHandler(async (_req, _res) => {
	return _res.send("Get All Questions");
});

// @desc    Delete  question
// @route   DELETE /api/question/delete/:question_id
// @access  Private
const delete_ = asyncHandler(async (_req, _res) => {
	return _res.send("Delete Question");
});

// @desc  Get question by id
// @route GET /api/question/get/:question_id
// @access Private
const get_by_question_id = asyncHandler(async (_req, _res) => {
	return _res.send("Get Question");
});



const question_controller = {
	add,
	get_all,
	update,
	delete_,
	get_by_question_id,
};
export default question_controller;
