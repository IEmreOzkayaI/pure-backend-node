import asyncHandler from "express-async-handler";
import interview_model from "../models/interviewModels/interview_model.js";
import interview_result_model from "../models/interviewModels/interview_result_model.js";
import chalk from "chalk";
import getTimestamp from "../utils/time_stamp.js";
import diagram_question_model from "../models/questionModels/diagram_question_model.js";
import algorithm_question_model from "../models/questionModels/algorithm_question_model.js";
import Diagram_question_model from "../models/questionModels/diagram_question_model.js";
import uuidBuffer from "uuid-buffer";
import test_question_model from "../models/questionModels/test_question_model.js";
// @desc    Get all interviews
// @route   GET /api/interview/get_all
// @access  Private
const get_all_interview = async (_req, _res) => {
    const interviews = await interview_model.find({});

    if (!interviews) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Interviews are not found -- Service : Interview Get All`));
        return _res.status(500).send("Interviews are not found");
    }

    return _res.status(200).json({
        message: "Interviews are found",
        status_code: "200",
        status: "success",
        data: interviews
    });
};

// @desc    Add new interview
// @route   POST /api/interview/add
// @access  Private
const add_interview = async (_req, _res) => {

    const diagram_questions = await diagram_question_model.find({
        _id: {
            $in: _req.body.questions.diagram_question_list.map(id => id)
        }
    })

    const algorithm_questions = await algorithm_question_model.find({
        _id: {
            $in: _req.body.questions.algorithm_question_list.map(id => id)
        }
    })

    const test_questions = await test_question_model.find({
        _id: {
            $in: _req.body.questions.test_question_list.map(id => id)
        }
    })

    const interview = await interview_model.create({
        name: _req.body.name,
        description: _req.body.description,
        questions: {
            diagram_question_list: diagram_questions,
            algorithm_question_list: algorithm_questions,
            test_question_list: test_questions,
        },
        company_list: _req.body.company_list,
        interview_time: _req.body.interview_time,
    });

    if (!interview) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Interview  is not created -- Service : Interview Add`));
        return _res.status(500).send("Interview is not created");
    }

    return _res.status(200).json({
        message: "Interview Created",
        status_code: "200",
        status: "success"
    });


};

// @desc    Get interview by interview id
// @route   GET /api/interview/get/:interview_id
// @access  Private
const get_by_interview_id = async (_req, _res) => {
    const interview = await interview_model.findById(_req.params.interview_id);
    let question_list = []
    if (!interview) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Interview is not found -- Service : Interview Get By Interview Id`));
        return _res.status(500).send("Interview is not found");
    }
    const diagram_questions = await Diagram_question_model.find({
        _id: {
            $in: interview.questions.diagram_question_list.map(item => uuidBuffer.toString(item))
        }
    });
    const algorithm_questions = await algorithm_question_model.find({
        _id: {
            $in: interview.questions.algorithm_question_list.map(item => uuidBuffer.toString(item))
        }
    });
    const test_questions = await test_question_model.find({
        _id: {
            $in: interview.questions.test_question_list.map(item => uuidBuffer.toString(item))
        }
    });
    const diagram_question_list = diagram_questions.map((item, index) => ({question: item, number: index , type:"Diagram"}));
    question_list.push(...diagram_question_list);
    const algorithm_question_list = algorithm_questions.map((item, index) => ({question: item, number: question_list.length + index,type:"Algorithm"}));
    question_list.push(...algorithm_question_list);
    const test_question_list = test_questions.map((item, index) => ({question: item, number: question_list.length + index,type:"Test"}));
    question_list.push(...test_question_list);
    const question_amount = diagram_questions.length + algorithm_questions.length + test_questions.length;

    const read_interview_dto = {
        name: interview.name,
        description: interview.description,
        questions: question_list,
        interview_time: interview.interview_time,
        question_amount: question_amount,
    }
    console.log("read_interview_dto", read_interview_dto)

    return _res.status(200).json({
        message: "Interview is found",
        status_code: "200",
        status: "success",
        data: read_interview_dto
    });
};

// @desc    Update interview by interview id
// @route   PUT /api/interview/update/:interview_id
// @access  Private
const update_interview = async (_req, _res) => {
    try {
        const interview = await interview_model.findById(_req.params.interview_id);
        if (interview) {
            // Update the question
            Object.assign(interview, _req.body);
            const updatedInterview = await interview_model.findByIdAndUpdate(_req.params.interview_id, interview, );
            if (updatedInterview) {
                console.log(chalk.bold(`${getTimestamp()} Status Code : 200 -- Message : Interview Updated -- Service : Interview Update`));
                return _res.status(200).json({
                    message: "Interview Updated",
                    status_code: "200",
                    status: "success",
                    data: updatedInterview
                });
            } else {
                console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Interview is not updated -- Service : Interview Update`));
                return _res.status(500).json({message: 'Interview is not updated'});
            }
        } else {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Interview Update`));
            return _res.status(404).json({message: 'Question not found'});
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Interview Update`));
        return _res.status(500).json({message: 'Server Error'});
    }
};

// @desc    Delete interview by interview id
// @route   DELETE /api/interview/delete/:interview_id
// @access  Private
const delete_interview = async (_req, _res) => {

    try {
        const question = await interview_model.findById(_req.params.interview_id);
        if (question) {
            await interview_model.findByIdAndDelete(_req.params.interview_id);
            return _res.status(200).json({
                message: "Interview Deleted",
                status_code: "200",
                status: "success",
            });
        } else {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Interview Not Found -- Service : Interview Delete`));
            return _res.status(404).json({message: 'Interview not found'});
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Interview Delete`));
        return _res.status(500).json({message: 'Server Error'});
    }
};

//@desc Get all interview results
//@route GET /api/interview/get_all_result
//@access Private
const get_all_result = async (_req, _res) => {
    return _res.send("Get All Result");
};

//@desc Add new interview result
//@route POST /api/interview/add_result
//@access Private
const add_result = async (_req, _res) => {
    return _res.send("Add Result");
};

//@desc Get interview result by interview result id
//@route GET /api/interview/get_result/:interview_result_id
//@access Private
const get_by_interview_result_id = async (_req, _res) => {
    return _res.send("Get By Interview Result Id");
};

//@desc Update interview result by interview result id
//@route PUT /api/interview/update_result/:interview_result_id
//@access Private
const update_result = async (_req, _res) => {
    return _res.send("Update Result");
};

//@desc Delete interview result by interview result id
//@route DELETE /api/interview/delete_result/:interview_result_id
//@access Private
const delete_result = async (_req, _res) => {
    return _res.send("Delete Result");
};

//@desc Get interview result by user id
//@route GET /api/interview/get_result/:user_id
//@access Private
const get_result_by_user_id = async (_req, _res) => {
    return _res.send("Get By User Id");
};

export default {
    get_all_interview,
    add_interview,
    get_by_interview_id,
    update_interview,
    delete_interview,
    get_all_result,
    add_result,
    get_by_interview_result_id,
    update_result,
    delete_result,
    get_result_by_user_id,
};

