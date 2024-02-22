import asyncHandler from "express-async-handler";
import test_question_model from "../../models/questionModels/test_question_model.js";
import test_question_result_model from "../../models/questionModels/test_question_result_model.js";
import chalk from "chalk";
import getTimestamp from "../../utils/time_stamp.js";
import Level_model from "../../models/level_model.js";
import Test_question_model from "../../models/questionModels/test_question_model.js";
import algorithm_question_model from "../../models/questionModels/algorithm_question_model.js";
import Algorithm_question_model from "../../models/questionModels/algorithm_question_model.js";

// @desc    Add new test question
// @route   POST /api/question/add_test
// @access  Private
const add_test = async (_req, _res) => {
    // Gelen verilerin dizi olup olmadığını kontrol et
    if (!Array.isArray(_req.body)) {
        return _res.status(400).send("Data should be an array");
    }

    // Tüm objeleri işle
    const promises = _req.body.map(async (testData) => {
        if (!testData.level) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level is required -- Service : Diagram Add`));
            return _res.status(400).send("Level is required");
        }

        const level_id = await Level_model.findOne({_id: testData.level});
        if (!level_id) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level is not found -- Service : Diagram Add`));
            return _res.status(400).send("Level is not found");
        }

        const test_question = await Test_question_model.create({
            name: testData.name,
            topic: testData.topic,
            level: testData.level,
            context: testData.context,
            question: testData.question,
            choices: testData.choices,
            answer: testData.answer,
            answer_explanation: testData.answer_explanation,
        });

        if (!test_question) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Test question is not created -- Service : Test Add`));
            return _res.status(500).send("Test question is not created");
        }
    });

    // Tüm promise'leri bekleyerek sonucu döndür
    await Promise.all(promises);

    return _res.status(200).json({
        message: "All Test Questions Created",
        status_code: "200",
        status: "success"
    });
};


// @desc    Get all test questions
// @route   GET /api/question/get_all_test
// @access  Private
const get_all_test = async (_req, _res) => {
    try {
        const questions = await Test_question_model.find({});
        if (!questions) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Questions Not Found -- Service : Test Get All`));
            return _res.status(404).json({message: 'Questions not found'});
        } else {
            for (let i = 0; i < questions.length; i++) {
                const level = await Level_model.findById(questions[i].level);
                if (level) {
                    questions[i].level = level;
                }
            }
            return _res.json(questions);
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Test Get All`));
        return _res.status(500).json({message: 'Server Error'});
    }
};

// @desc    Get test question
// @route   GET /api/question/get_test/:test_id
// @access  Private
const get_test_by_id = async (_req, _res) => {
    try {
        const question = await Test_question_model.findById(_req.params.test_id);
        if (question) {
            const level = await Level_model.findById(question.level);
            if (level) {
                question.level = level;
                console.log(question.level)
                const read_test_dto = {
                    _id: question._id,
                    topic: question.topic,
                    level: question.level,
                    context: question.context,
                    question: question.question,
                    choices: question.choices,
                    answer: question.answer,
                    answer_explanation: question.answer_explanation,
                }
                return _res.json(read_test_dto);
            } else {
                console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Level Not Found -- Service : Test Get By Id`));
                return _res.status(404).json({message: 'Level not found'});
            }
        } else {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Get Get By Id`));
            return _res.status(404).json({message: 'Question not found'});
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Get Get By Id`));
        return _res.status(500).json({message: 'Server Error'});
    }
};

// @desc    Update test question
// @route   PUT /api/question/update_test/:test_id
// @access  Private
const update_test = async (_req, _res) => {
    try {
        const question = await Test_question_model.findById(_req.params.test_id);
        if (question) {
            // Update the question
            Object.assign(question, _req.body);
            const updatedQuestion = await Test_question_model.findByIdAndUpdate(_req.params.test_id, question,);
            if (updatedQuestion) {
                console.log(chalk.bold(`${getTimestamp()} Status Code : 200 -- Message : Algorithm Updated -- Service : Test Update`));
                return _res.status(200).json({
                    message: "Test Updated",
                    status_code: "200",
                    status: "success",
                    data: updatedQuestion
                });
            } else {
                console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Test is not updated -- Service : Test Update`));
                return _res.status(500).json({message: 'Algorithm is not updated'});
            }
        } else {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Test Update`));
            return _res.status(404).json({message: 'Question not found'});
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Test Update`));
        return _res.status(500).json({message: 'Server Error'});
    }
};

// @desc    Delete test question
// @route   DELETE /api/question/delete_test/:test_id
// @access  Private
const delete_test = async (_req, _res) => {
    try {
        const question = await Test_question_model.findById(_req.params.test_id);
        if (question) {
            await Test_question_model.findByIdAndDelete(_req.params.test_id);
            return _res.json({message: 'Question removed'});
        } else {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Test Delete`));
            return _res.status(404).json({message: 'Question not found'});
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Test Delete`));
        return _res.status(500).json({message: 'Server Error'});
    }
};

// @desc    Get test question by level
// @route   GET /api/question/get_test/:level_id
// @access  Private
const get_test_by_level = async (_req, _res) => {
    try {
        const level = await Level_model.findById(_req.params.level_id);
        if (!level) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Level Not Found -- Service : Test Get By Level`));
            return _res.status(404).json({message: 'Level not found'});
        }
        const questions = await Test_question_model.find({level_id: _req.params.level_id});
        if (!questions) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Questions Not Found -- Service : Test Get By Level`));
            return _res.status(404).json({message: 'Questions not found'});
        }
        return _res.json(questions);
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Test Get By Level`));
        return _res.status(500).json({message: 'Server Error'});
    }
};

const test_question_controller = {
    add_test,
    get_all_test,
    get_test_by_id,
    update_test,
    delete_test,
    get_test_by_level
}
export default test_question_controller;