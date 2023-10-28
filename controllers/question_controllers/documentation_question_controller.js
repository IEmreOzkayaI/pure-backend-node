import asyncHandler from "express-async-handler";
import documentation_question_model from "../../models/questionModels/documentation_question_model.js";
import documentation_question_result_model from "../../models/questionModels/documentation_question_result_model.js";

// @desc    Add new documentation question
// @route   POST /api/question/add_documentation
// @access  Private
const add_documentation = asyncHandler(async (_req, _res) => {
    return _res.send("Add Documentation")
});

// @desc    Get all documentation questions
// @route   GET /api/question/get_all_documentation
// @access  Private
const get_all_documentation = asyncHandler(async (_req, _res) => {
    return _res.send("Get All Documentation")
});

// @desc    Get documentation question
// @route   GET /api/question/get_documentation/:documentation_id
// @access  Private
const get_documentation_by_id = asyncHandler(async (_req, _res) => {
    return _res.send("Get Documentation")
});

// @desc    Update documentation question
// @route   PUT /api/question/update_documentation/:documentation_id
// @access  Private
const update_documentation = asyncHandler(async (_req, _res) => {
    return _res.send("Update Documentation")
});

// @desc    Delete documentation question
// @route   DELETE /api/question/delete_documentation/:documentation_id
// @access  Private
const delete_documentation = asyncHandler(async (_req, _res) => {
    return _res.send("Delete Documentation")
});

// @desc    Get documentation question by level
// @route   GET /api/question/get_documentation/:level_id
// @access  Private
const get_documentation_by_level = asyncHandler(async (_req, _res) => {
    return _res.send("Get Documentation By Level")
});

const documentation_question_controller = {
    add_documentation,
    get_all_documentation,
    get_documentation_by_id,
    update_documentation,
    delete_documentation,
    get_documentation_by_level
}
export default documentation_question_controller;