import asyncHandler from "express-async-handler";
import documentation_question_model from "../../models/questionModels/documentation_question_model.js";
import documentation_question_result_model from "../../models/questionModels/documentation_question_result_model.js";

import algorithm_question_model from "../../models/questionModels/algorithm_question_model.js";
import algorithm_question_result_model from "../../models/questionModels/algorithm_question_result_model.js";

import diagram_question_model from "../../models/questionModels/diagram_question_model.js";
import diagram_question_result_model from "../../models/questionModels/diagram_question_result_model.js";

import test_question_model from "../../models/questionModels/test_question_model.js";
import test_question_result_model from "../../models/questionModels/test_question_result_model.js";
import level_model from "../../models/level_model.js";
import chalk from "chalk";
import getTimestamp from "../../utils/time_stamp.js";

// @desc    Add new question
// @route   POST /api/question/add
// @access  Private
const add = async (_req, _res) => {
    return _res.send("Add Question");
};

// @desc    Update  question
// @route   PUT /api/question/update/:question_id
// @access  Private
const update = async (_req, _res) => {
    return _res.send("Update Question");
};

// @desc    Get all  questions
// @route   GET /api/question/get_all
// @access  Private
const get_all =async (_req, _res) => {
    return _res.send("Get All Questions");
};

// @desc    Delete  question
// @route   DELETE /api/question/delete/:question_id
// @access  Private
const delete_ = async (_req, _res) => {
    return _res.send("Delete Question");
};

// @desc  Get question by id
// @route GET /api/question/get/:question_id
// @access Private
const get_by_question_id = async (_req, _res) => {
    const {question_id, question_type} = _req.query;
    try{
        switch (question_type){
            case "test":
                let test_question = await test_question_model.findById(question_id);
                if (!test_question) {
                    console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Get Question`));
                    return _res.status(404).json({ message: 'Question not found' });
                }
                test_question.level = (await level_model.findById(test_question.level));
                let modified_test_question = {...test_question.toObject(), type: "Test"};
                return _res.json(modified_test_question);
            case "diagram":
                let diagram_question = await diagram_question_model.findById(question_id);
                if (!diagram_question) {
                    console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Get Question`));
                    return _res.status(404).json({ message: 'Question not found' });
                }
                diagram_question.level = (await level_model.findById(diagram_question.level));
                let modified_diagram_question = {...diagram_question.toObject(), type: "Diagram"};
                return _res.json(modified_diagram_question);
            case "algorithm":
                let algorithm_question = await algorithm_question_model.findById(question_id);
                if (!algorithm_question) {
                    console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Get Question`));
                    return _res.status(404).json({ message: 'Question not found' });
                }
                algorithm_question.level = (await level_model.findById(algorithm_question.level));
                let modified_algorithm_question = {...algorithm_question.toObject(), type: "Algorithm"};
                return _res.json(modified_algorithm_question);
            default:
                console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Type Not Found -- Service : Get Question`));
                return _res.status(404).json({ message: 'Question type not found' });
        }
    }catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error.message} -- Service : Get Question`));
        return _res.status(500).json({ message: 'Internal Server Error' });
    }
};

const get = async (_req, _res) => {

    const {question_type, question_level, question_topic} = _req.query;

    const level_id = await level_model.findOne({name: question_level});
    if (!level_id) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Level Not Found -- Service : Get Question`));
        return _res.status(404).json({message: 'Level not found'});
    }

    const projection = question_topic ? 'name , topic' : 'topic';

    try {
        switch (question_type) {
            case "test":
                let test_questions = await test_question_model.find(
                    question_topic ? { level: level_id._id, topic: question_topic } : { level: level_id._id },
                    projection
                );
                test_questions.forEach((question, index) => {
                    let questionObj = question.toObject();
                    questionObj.type = "Test";
                    test_questions[index] = questionObj;
                });
                return _res.json(test_questions);
            case "diagram":
                let diagram_questions = await diagram_question_model.find(
                    question_topic ? { level: level_id._id, topic: question_topic} : { level: level_id._id },
                    projection
                );
                diagram_questions.forEach((question, index) => {
                    let questionObj = question.toObject();
                    questionObj.type = "Diagram";
                    diagram_questions[index] = questionObj;
                });
                return _res.json(diagram_questions);
            case "algorithm":
                let algorithm_questions = await algorithm_question_model.find(
                    question_topic ? { level: level_id._id, topic: question_topic } : { level: level_id._id },
                    projection
                );
                algorithm_questions.forEach((question, index) => {
                    let questionObj = question.toObject();
                    questionObj.type = "Algorithm";
                    algorithm_questions[index] = questionObj;
                });
                return _res.json(algorithm_questions);
            default:
                console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Type Not Found -- Service : Get Question`));
                return _res.status(404).json({ message: 'Question type not found' });
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error.message} -- Service : Get Question`));
        return _res.status(500).json({ message: 'Internal Server Error' });
    }
}


const question_controller = {
    get,
    add,
    get_all,
    update,
    delete_,
    get_by_question_id,
};
export default question_controller;
