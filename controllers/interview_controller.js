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
import level_model from "../models/level_model.js";
import json from "jsonwebtoken";
import Individual_User from "../models/user_models/individual_user_model.js";
import Common_User from "../models/user_models/common_user_model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import user_controller from "./user_controller.js";
import send_email from "../utils/send_email.js";
import * as Pure_OTP from "../utils/pure_otp.js";

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
// asd
    const interview = await interview_model.create({
        name: _req.body.name,
        description: _req.body.description,
        interview_time: _req.body.interview_time,
        questions: {
            diagram_question_list: diagram_questions,
            algorithm_question_list: algorithm_questions,
            test_question_list: test_questions,
        },
        company_list: _req.body.company_list,
        start_date: _req.body.start_date,
        end_date: _req.body.end_date,
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

    let end_date = interview.end_date.split('-')
    end_date = new Date(end_date[2], end_date[1] - 1, end_date[0]);
    const reachable_time = Math.floor((new Date() - end_date) / 1000);
    let interview_share_link = json.sign({interview_id: interview._id}, process.env.INTERVIEW_SIGN_SECRET, {expiresIn: reachable_time});
    interview_share_link = `http://localhost:3000/interview/signUp/${btoa(interview_share_link)}`;
    const read_interview_dto = {
        name: interview.name,
        description: interview.description,
        questions: question_list,
        interview_time: interview.interview_time,
        question_amount: question_amount,
        share_link:interview_share_link,
        interviewee_list: interview.interviewee_list
    }

    return _res.status(200).json({
        message: "Interview is found",
        status_code: "200",
        status: "success",
        data: read_interview_dto
    });
};

const get_by_company_id = async (_req, _res) => {
    const interviews = await interview_model.find({
        company_list: _req.params.company_id
    });


    const extracted_interviews = interviews.map(interview => {
        return {
            id: interview._id,
            name: interview.name,
            start_date: interview.start_date,
            end_date: interview.end_date,
            question_amount: interview.questions.diagram_question_list.length + interview.questions.algorithm_question_list.length + interview.questions.test_question_list.length
        }
    })

    if (!interviews) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Interviews are not found -- Service : Interview Get By Company Id`));
        return _res.status(500).send("Interviews are not found");
    }

    return _res.status(200).json({
        message: "Interviews are found",
        status_code: "200",
        status: "success",
        data: extracted_interviews
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

//@desc Register user to interview
//@route POST /api/interview/register_user_to_interview/:interview_id
//@access Private
const register_user_to_interview = async (_req, _res) => {
  const signed_interview_id = atob(_req.params.interview_id);
  const interview_id = json.verify(signed_interview_id, process.env.INTERVIEW_SIGN_SECRET, (err, decoded) => {
    if (err) {
      console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : ${err} -- Service : Register User To Interview`));
      return _res.status(401).json({message: 'Invalid Token'});
    }
    return decoded.interview_id;
  });
  const interview = await interview_model.findById(interview_id);

  if (!interview) {
      console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Interview Not Found -- Service : Register User To Interview`));
      return _res.status(404).json({message: 'Interview not found'});
  }

  try {
      let DB_access = Individual_User;
      let user_id_field = "individual_user_id";
      //----- Profile Check
      if (_req.body.email === "" || _req.body.password === "") {
          console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Email or Password Not Found -- Service : Register`));
          return _res.status(400).send({message: "Email or Password Not Found", status_code: "400", status: "error"});
      }

      if (!(_req.body.role !== "Company_User" || _req.body.role !== "Individual_User" || _req.body.role !== "Admin_User")) {
          console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : User Role Not Found -- Service : Register`));
          return _res.status(400).send({message: "User Profile Not Found", status_code: "400", status: "error"});
      }

      if (_req.body.status !== undefined) {
          console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Status Can Not Send -- Service : Register`));
          return _res.status(400).send({
              message: "User status can not send specifically",
              status_code: "400",
              status: "error"
          });
      }

      try {
          const is_user_available = await Common_User.findOne({email: _req.body.email});
          if (is_user_available) throw new Error("User Already Exists");
      } catch (error) {
          console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : ${error} -- Service : Register`));
          return _res.status(400).json({message: "User Already Exists", status_code: "400", status: "error"});
      }

      //----- User Register
      const user_register_info = {..._req.body};
      delete user_register_info.role;


      user_register_info.password = await bcrypt.hash(Buffer.from(_req.body.password, "utf-8"), 10);
      //----- User Register to DB & Response
      try {
          const user_registered = await DB_access.create(user_register_info);
          if (!user_registered) {
              throw new Error("User Register Error");
          }
          console.info(chalk.green.bold(`${getTimestamp()} Status Code : 201 -- Info : User Saved -- ID : ${user_registered._id}  -- User DB`));
          const userId = user_registered._id.toString();
          //------------------
          const query = {};
          query[user_id_field] = user_registered._id;
          const secret_key = Pure_OTP.generateSecretKey();
          await Common_User.create({
              email: _req.body.email,
              role: _req.body.role,
              user_id: userId,
              totp_secret_key: secret_key
          });
          console.info(chalk.green.bold(`${getTimestamp()} Status Code : 201 -- Info : User Secret Saved -- ID : ${user_registered._id} -- Auth DB`));
          //------------------

          send_email(_req.body.email, "Interview Application Registered", "interview_register");

          interview.interviewee_list.push(userId);
          await interview.save();

          console.info(chalk.green.bold(`${getTimestamp()} Status Code : 201 -- Info : User Registered To Interview -- ID : ${user_registered._id}`));
          return _res.status(201).json({
              message: "User Registered To Interview",
              status_code: "201",
              status: "success"
          });
      } catch (error) {
          console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : ${error} -- Service : Register`));
          return _res.status(400).json({message: "Invalid User Data", status_code: "400", status: "error"});
      }
  } catch (error) {
      console.error(chalk.bold(`${getTimestamp()} Status Code : 503 -- Error : ${error} -- Service : Register`));
      return _res.status(503).json({message: "Server Error", status_code: "503", status: "error"});
  }
}

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
    get_by_company_id,
    register_user_to_interview

};
