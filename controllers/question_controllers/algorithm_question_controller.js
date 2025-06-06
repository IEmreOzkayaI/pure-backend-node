import algorithm_question_model from "../../models/questionModels/algorithm_question_model.js";
import {exec} from "child-process-promise";
import fs from "fs";
import Algorithm_question_model from "../../models/questionModels/algorithm_question_model.js";
import chalk from "chalk";
import getTimestamp from "../../utils/time_stamp.js";
import Level_model from "../../models/level_model.js";
// @desc    Solve algorithm question
// @route   POST /api/question/solve_algorithm
// @access  Private
const runAndClean = async (command, filePath, _res , input , output) => {
    try {
        console.log("command", command);
        console.log("filePath", filePath);

        const {stdout, stderr} = await execPromise(command);
        // await fs.unlink(filePath, (err) => {
        // });
        // _res.send(stdout || stderr);
        console.log(stdout)
        _res.status(200).json({
            message: "Algorithm Question Created",
            status_code: "200",
            status: "success",
            data: {
                input: input,
                output: output,
                result: stdout
            }
        });

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
        }).then(r => {
            console.log(r);
        }).catch(e => {
            console.log(e);
        });
    });
};

const run_algorithm = async (_req, _res) => {
    try {
        let {language, code, _id} = _req.body;
        language = language.split('/')[2].toLowerCase();
        let input = '';
        language = language === 'csp' ? 'csharp' : language;
        // language detection
        const allowedLanguages = ['python', 'javascript', 'csharp', 'java'];
        const print_types = {
            'java': 'System.out.println',
            'csharp': 'Console.WriteLine',
            'python': 'print',
            'javascript': 'console.log',
        }
        if (!allowedLanguages.includes(language)) {
            _res.status(400).json({
                message: "Unsupported language",
                status_code: "400",
                status: "error",
                data: language
            });
        }

        //take question from db
        const algorithm_question = await Algorithm_question_model.findById(_id);
        if (!algorithm_question) {
            _res.status(400).json({
                message: "Question not found",
                status_code: "400",
                status: "error",
                data: _id
            });
        }

        const function_parameters = algorithm_question.parameter_list[language];
        const print_type = print_types[language];
        const first_test_input = algorithm_question.test_cases[0].input;
        const first_test_output = algorithm_question.test_cases[0].output;

        // JavaScript kodunu analiz ederek fonksiyon adını alabiliriz
        const regex = /([a-zA-Z]+)\(/;
        const functionName = code.match(regex);
        if (functionName && functionName[1]) {
            console.log("Function name: " + functionName[1]);
        } else {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Function name not found -- Service : Run Algorithm`));
        }

        function_parameters.forEach((parameter) => {
            input = `${parameter} = ${first_test_input}`;
        });
        console.error("function_parameters", function_parameters);
        code = input + '\n' + code + '\n' + `${print_type}(${functionName[1]}(${function_parameters[0]?.split(" ")[1]}))`;
        console.log("code", code);


        //create random file name
        const random = Math.random().toString(36).substring(7);


        let command = '';

        switch (language) {
            case 'java':
                command = `javac ${random}.java && java ${random}`;
                break;
            case 'csharp':
                command = `csc ${random}.cs && ${random}.exe`;
                break;
            case 'python':
                command = `python ${random}.py`;
                break;
            case 'javascript':
                command = `node ${random}.js`;
                break;
            default:
                return _res.status(400).send('Desteklenmeyen dil');
        }

        const filePath = `./${command.split(' ')[1]}`;

        await fs.writeFile(filePath, code, (err) => {
            if (err) {
                console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${err} -- Service : Run Algorithm`));
                _res.status(500).json({
                    message: "Unexpected error occurred while writing file",
                    status_code: "500",
                    status: "error",
                });
            }
        });

        await runAndClean(command, filePath, _res , first_test_input , first_test_output);
    } catch (error) {
        console.error('Hata:', error);
        _res.status(500).send('Beklenmeyen bir hata oluştu');
    }
};

// @desc    Add new algorithm question
// @route   POST /api/question/add_algorithm
// @access  Private
const add_algorithm = async (_req, _res) => {

    if (!_req.body.level) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level is required -- Service : Algorithm Add`));
        return _res.status(400).send("Level is required");
    }
    const level_id = await Level_model.findOne({_id: _req.body.level});
    if (!level_id) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level is not found -- Service : Algorithm Add`));
        return _res.status(400).send("Level is not found");
    }

    const algorithm_added = await Algorithm_question_model.create({
        name: _req.body.name,
        topic: _req.body.topic,
        level: _req.body.level,
        description: _req.body.description,
        real_life_application: _req.body.real_life_application,
        time_complexity_analysis: _req.body.time_complexity_analysis,
        parameter_list: _req.body.parameter_list,
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

    return _res.status(200).json({
        message: "Algorithm Question Created",
        status_code: "200",
        status: "success"
    });
};

// @desc    Get all algorithm questions
// @route   GET /api/question/get_all_algorithm
// @access  Private
const get_all_algorithm = async (_req, _res) => {
    try {
        const questions = await algorithm_question_model.find({});
        if (!questions) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Questions Not Found -- Service : Algorithm Get All`));
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
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Algorithm Get All`));
        return _res.status(500).json({message: 'Server Error'});
    }
};

// @desc    Get algorithm question
// @route   GET /api/question/get_algorithm_question_part_by_id/:algorithm_id
// @access  Private
const get_algorithm_question_part_by_id = async (_req, _res) => {
    try {
        const question = await algorithm_question_model.findById(_req.params.algorithm_id);
        if (question) {
            const level = await Level_model.findById(question.level);
            if (level) {
                question.level = level;
                console.log(question.level)
                const read_algorithm_dto = {
                    _id: question._id,
                    name: question.name,
                    topic: question.topic,
                    level: question.level.name,
                    description: question.description,
                    real_life_application: question.real_life_application,
                    time_complexity_analysis: question.time_complexity_analysis,
                    example_input: question.example_input,
                    example_output: question.example_output,
                    missing_part: question.missing_part,
                    additional_resources_about_algorithm_and_topic: question.additional_resources_about_algorithm_and_topic,
                    interactive_steps: question.interactive_steps
                }
                return _res.json(read_algorithm_dto);
            } else {
                console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Level Not Found -- Service : Algorithm Get By Id`));
                return _res.status(404).json({message: 'Level not found'});
            }
        } else {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Algorithm Get By Id`));
            return _res.status(404).json({message: 'Question not found'});
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Algorithm Get By Id`));
        return _res.status(500).json({message: 'Server Error'});
    }
};


// @desc    Get algorithm question
// @route   GET /api/question/get_algorithm_answer_part_by_id/:algorithm_id
// @access  Private
const get_algorithm_answer_part_by_id = async (_req, _res) => {
    try {
        const question = await algorithm_question_model.findById(_req.params.algorithm_id);
        if (question) {
            const level = await Level_model.findById(question.level);
            if (level) {
                question.level = level;
                console.log(question.level)
                const read_algorithm_dto = {
                    _id: question._id,
                    answer: question.answer,
                    answer_explanation: question.answer_explanation,
                    test_cases: question.test_cases,
                }
                return _res.json(read_algorithm_dto);
            } else {
                console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Level Not Found -- Service : Algorithm Get By Id`));
                return _res.status(404).json({message: 'Level not found'});
            }
        } else {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Algorithm Get By Id`));
            return _res.status(404).json({message: 'Question not found'});
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Algorithm Get By Id`));
        return _res.status(500).json({message: 'Server Error'});
    }
};

// @desc    Update algorithm question
// @route   PUT /api/question/update_algorithm/:algorithm_id
// @access  Private
const update_algorithm = async (_req, _res) => {
    try {
        const question = await algorithm_question_model.findById(_req.params.algorithm_id);
        if (question) {
            // Update the question
            Object.assign(question, _req.body);
            const updatedQuestion = await algorithm_question_model.findByIdAndUpdate(_req.params.algorithm_id, question,);
            if (updatedQuestion) {
                console.log(chalk.bold(`${getTimestamp()} Status Code : 200 -- Message : Algorithm Updated -- Service : Algorithm Update`));
                return _res.status(200).json({
                    message: "Algorithm Updated",
                    status_code: "200",
                    status: "success",
                    data: updatedQuestion
                });
            } else {
                console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Algorithm is not updated -- Service : Algorithm Update`));
                return _res.status(500).json({message: 'Algorithm is not updated'});
            }
        } else {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Algorithm Update`));
            return _res.status(404).json({message: 'Question not found'});
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Algorithm Update`));
        return _res.status(500).json({message: 'Server Error'});
    }
};

// @desc    Delete algorithm question
// @route   DELETE /api/question/delete_algorithm/:algorithm_id
// @access  Private
const delete_algorithm = async (_req, _res) => {
    try {
        const question = await algorithm_question_model.findById(_req.params.algorithm_id);
        if (question) {
            await algorithm_question_model.findByIdAndDelete(_req.params.algorithm_id);
            return _res.json({message: 'Question removed'});
        } else {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Algorithm Delete`));
            return _res.status(404).json({message: 'Question not found'});
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Algorithm Delete`));
        return _res.status(500).json({message: 'Server Error'});
    }
};

// @desc    Get algorithm question by level
// @route   GET /api/question/get_algorithm/:level_id
// @access  Private
const get_algorithm_by_level = async (_req, _res) => {
    try {
        const level = await Level_model.findById(_req.params.level_id);
        if (!level) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Level Not Found -- Service : Algorithm Get By Level`));
            return _res.status(404).json({message: 'Level not found'});
        }
        const questions = await Algorithm_question_model.find({level_id: _req.params.level_id});
        if (!questions) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Questions Not Found -- Service : Algorithm Get By Level`));
            return _res.status(404).json({message: 'Questions not found'});
        }
        return _res.json(questions);
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Algorithm Get By Level`));
        return _res.status(500).json({message: 'Server Error'});
    }
};

const algorithm_question_controller = {
    add_algorithm,
    get_all_algorithm,
    get_algorithm_question_part_by_id,
    get_algorithm_answer_part_by_id,
    update_algorithm,
    delete_algorithm,
    get_algorithm_by_level,
    run_algorithm
}
export default algorithm_question_controller;