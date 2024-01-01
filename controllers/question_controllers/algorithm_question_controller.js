import algorithm_question_model from "../../models/questionModels/algorithm_question_model.js";
import algorithm_question_result_model from "../../models/questionModels/algorithm_question_result_model.js";
import technologies from "../../middlewares/technologies.js";
import {exec} from "child-process-promise";
import {randomBytes} from "crypto";
import fs from "fs";
import Algorithm_question_model from "../../models/questionModels/algorithm_question_model.js";
import chalk from "chalk";
import getTimestamp from "../../utils/time_stamp.js";
import Level_model from "../../models/level_model.js";
// @desc    Solve algorithm question
// @route   POST /api/question/solve_algorithm
// @access  Private
const runAndClean = async (command, filePath, _res) => {
    try {
        console.log("command", command);
        console.log("filePath", filePath);

        const {stdout, stderr} = await execPromise(command);
        await fs.unlink(filePath, (err) => {
        });
        _res.send(stdout || stderr);
    } catch (err) {
        console.error('Hata:', err);
        _res.status(500).send('Beklenmeyen bir hata oluştu');
    }
};

const execPromise = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve({stdout, stderr});
            }
        });
    });
};

const run_algorithm = async (_req, _res) => {
    try {
        const {language, code} = _req.body;

        const allowedLanguages = ['php', 'python', 'node', 'c', 'cpp'];
        const random = Math.random().toString(36).substring(7);

        if (!allowedLanguages.includes(language)) {
            return _res.status(400).send('Desteklenmeyen dil');
        }

        let command = '';

        switch (language) {
            case 'php':
                command = `php ${random}.php`;
                break;
            case 'python':
                command = `python ${random}.py`;
                break;
            case 'node':
                command = `node ${random}.js`;
                break;
            case 'c':
                command = `gcc ${random}.c -o ${random}.exe && ./${random}.exe`;
                break;
            case 'cpp':
                command = `g++ ${random}.cpp -o ${random}.exe && ./${random}.exe`;
                break;
            default:
                return _res.status(400).send('Desteklenmeyen dil');
        }

        const filePath = `./${command.split(' ')[1]}`;

        await fs.writeFile(filePath, code, (err) => {
        });

        await runAndClean(command, filePath, _res);
    } catch (error) {
        console.error('Hata:', error);
        _res.status(500).send('Beklenmeyen bir hata oluştu');
    }
};

// @desc    Add new algorithm question
// @route   POST /api/question/add_algorithm
// @access  Private
const add_algorithm = async (_req, _res) => {

    if (!_req.body.level){
        console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level is required -- Service : Algorithm Add`));
        return _res.status(400).send("Level is required");
    }
    const level_id = await Level_model.findOne({name: _req.body.level});
    if (!level_id) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level is not found -- Service : Algorithm Add`));
        return _res.status(400).send("Level is not found");
    }

    const algorithm_added = await Algorithm_question_model.create({
        name: _req.body.name,
        topic: _req.body.topic,
        level: _req.body.level_id,
        description: _req.body.description,
        real_life_application: _req.body.real_life_application,
        time_complexity_analysis: _req.body.time_complexity_analysis,
        example_input: _req.body.example_input,
        example_output: _req.body.example_output,
        missing_part: _req.body.missing_part,
        answer: _req.body.answer,
        answer_explanation: _req.body.answer_explanation,
        test_cases: _req.body.test_cases,
        additional_resources_about_algorithm_and_topic: _req.body.additional_resources_about_algorithm_and_topic,
        interactive_steps: _req.body.interactive_steps
    });
    if (!algorithm_added) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Algorithm Question Couldn't Create -- Service : Algorithm Add`));
        return _res.status(400).send("Algorithm couldn't be added");
    }



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
const delete_algorithm = async (_req, _res) => {
    return _res.send("Delete Algorithm")
};

// @desc    Get algorithm question by level
// @route   GET /api/question/get_algorithm/:level_id
// @access  Private
const get_algorithm_by_level = async (_req, _res) => {
    return _res.send("Get Algorithm By Level")
};

const algorithm_question_controller = {
    add_algorithm,
    get_all_algorithm,
    get_algorithm_by_id,
    update_algorithm,
    delete_algorithm,
    get_algorithm_by_level,
    run_algorithm
}
export default algorithm_question_controller;