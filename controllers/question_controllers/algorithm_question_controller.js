import algorithm_question_model from "../../models/questionModels/algorithm_question_model.js";
import algorithm_question_result_model from "../../models/questionModels/algorithm_question_result_model.js";

// @desc    Add new algorithm question
// @route   POST /api/question/add_algorithm
// @access  Private
const add_algorithm = async (_req, _res) => {
    return _res.send("Add Algorithm")
};

// @desc    Get all algorithm questions
// @route   GET /api/question/get_all_algorithm
// @access  Private
const get_all_algorithm = async (_req, _res) => {
    return _res.send("Get All Algorithm")
};

// @desc    Get algorithm question
// @route   GET /api/question/get_algorithm/:algorithm_id
// @access  Private
const get_algorithm_by_id = async (_req, _res) => {
    return _res.send("Get Algorithm")
};

// @desc    Update algorithm question
// @route   PUT /api/question/update_algorithm/:algorithm_id
// @access  Private
const update_algorithm = async (_req, _res) => {
    return _res.send("Update Algorithm")
};

// @desc    Delete algorithm question
// @route   DELETE /api/question/delete_algorithm/:algorithm_id
// @access  Private
const delete_algorithm =async (_req, _res) => {
    return _res.send("Delete Algorithm")
};

// @desc    Get algorithm question by level
// @route   GET /api/question/get_algorithm/:level_id
// @access  Private
const get_algorithm_by_level =async (_req, _res) => {
    return _res.send("Get Algorithm By Level")
};


const algorithm_question_controller = {
    add_algorithm,
    get_all_algorithm,
    get_algorithm_by_id,
    update_algorithm,
    delete_algorithm,
    get_algorithm_by_level
}
export default algorithm_question_controller;