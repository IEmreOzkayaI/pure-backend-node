import asyncHandler from "express-async-handler";
import test_question_model from "../../models/questionModels/test_question_model.js";
import test_question_result_model from "../../models/questionModels/test_question_result_model.js";

// @desc    Add new test question
// @route   POST /api/question/add_test
// @access  Private
const add_test = asyncHandler(async (_req, _res) => {
    return _res.send("Add Test")
});

// @desc    Get all test questions
// @route   GET /api/question/get_all_test
// @access  Private
const get_all_test = asyncHandler(async (_req, _res) => {
    return _res.send("Get All Test")
});

// @desc    Get test question
// @route   GET /api/question/get_test/:test_id
// @access  Private
const get_test_by_id = asyncHandler(async (_req, _res) => {
    return _res.send("Get Test")
});

// @desc    Update test question
// @route   PUT /api/question/update_test/:test_id
// @access  Private
const update_test = asyncHandler(async (_req, _res) => {
    return _res.send("Update Test")
});

// @desc    Delete test question
// @route   DELETE /api/question/delete_test/:test_id
// @access  Private
const delete_test = asyncHandler(async (_req, _res) => {
    return _res.send("Delete Test")
});

// @desc    Get test question by level
// @route   GET /api/question/get_test/:level_id
// @access  Private
const get_test_by_level = asyncHandler(async (_req, _res) => {
    return _res.send("Get Test By Level")
});

const test_question_controller = {
    add_test,
    get_all_test,
    get_test_by_id,
    update_test,
    delete_test,
    get_test_by_level
}   
export default test_question_controller;