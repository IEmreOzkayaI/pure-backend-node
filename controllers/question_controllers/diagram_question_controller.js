import asyncHandler from "express-async-handler";
import diagram_question_model from "../../models/questionModels/diagram_question_model.js";
import diagram_question_result_model from "../../models/questionModels/diagram_question_result_model.js";

// @desc    Add new diagram question
// @route   POST /api/question/add_diagram
// @access  Private
const add_diagram = asyncHandler(async (_req, _res) => {
	return _res.send("Add Diagram");
});

// @desc    Get all diagram questions
// @route   GET /api/question/get_all_diagram
// @access  Private
const get_all_diagram = asyncHandler(async (_req, _res) => {
	return _res.send("Get All Diagram");
});

// @desc    Get diagram question
// @route   GET /api/question/get_diagram/:diagram_id
// @access  Private
const get_diagram_by_id = asyncHandler(async (_req, _res) => {
	return _res.send("Get Diagram");
});

// @desc    Update diagram question
// @route   PUT /api/question/update_diagram/:diagram_id
// @access  Private
const update_diagram = asyncHandler(async (_req, _res) => {
	return _res.send("Update Diagram");
});

// @desc    Delete diagram question
// @route   DELETE /api/question/delete_diagram/:diagram_id
// @access  Private
const delete_diagram = asyncHandler(async (_req, _res) => {
	return _res.send("Delete Diagram");
});

// @desc    Get diagram question by level
// @route   GET /api/question/get_diagram/:level_id
// @access  Private
const get_diagram_by_level = asyncHandler(async (_req, _res) => {
	return _res.send("Get Diagram By Level");
});

const diagram_question_controller = {
	add_diagram,
	get_all_diagram,
	get_diagram_by_id,
	update_diagram,
	delete_diagram,
	get_diagram_by_level,
};
export default diagram_question_controller;
