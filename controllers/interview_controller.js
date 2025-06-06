import asyncHandler from "express-async-handler";
import interview_model from "../models/interviewModels/interview_model.js";
import interview_result_model, {INTERVIEW_RESULT_STATUS_ENUM} from "../models/interviewModels/interview_result_model.js";
import chalk from "chalk";
import getTimestamp from "../utils/time_stamp.js";
import diagram_question_model from "../models/questionModels/diagram_question_model.js";
import algorithm_question_model from "../models/questionModels/algorithm_question_model.js";
import Diagram_question_model from "../models/questionModels/diagram_question_model.js";
import uuidBuffer from "uuid-buffer";
import test_question_model from "../models/questionModels/test_question_model.js";
import level_model from "../models/level_model.js";
import Individual_User from "../models/user_models/individual_user_model.js";
import Common_User from "../models/user_models/common_user_model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import user_controller from "./user_controller.js";
import send_email from "../utils/send_email.js";
import * as Pure_OTP from "../utils/pure_otp.js";
import fs from "fs";
import jwt from "jsonwebtoken";
import Auth from "../models/auth_model.js";

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
		data: interviews,
	});
};

// @desc    Add new interview
// @route   POST /api/interview/add
// @access  Private
const add_interview = async (_req, _res) => {
	const diagram_questions = await diagram_question_model.find({
		_id: {
			$in: _req.body.questions.diagram_question_list.map((id) => id),
		},
	});

	const algorithm_questions = await algorithm_question_model.find({
		_id: {
			$in: _req.body.questions.algorithm_question_list.map((id) => id),
		},
	});

	const test_questions = await test_question_model.find({
		_id: {
			$in: _req.body.questions.test_question_list.map((id) => id),
		},
	});

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
		status: "success",
	});
};

// @desc    Get interview by interview id
// @route   GET /api/interview/get/:interview_id
// @access  Private
const get_by_interview_signature = async (_req, _res) => {
	const interview = await interview_model.findById(_req.interview_signature_info.interview_id);
	const interview_result = await interview_result_model.findOne({interview_id: _req.interview_signature_info.interview_id, user_id: _req.interview_signature_info.user_id});
	let question_list = [];
	if (!interview) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Interview is not found -- Service : Interview Get By Interview Id`));
		return _res.status(500).send("Interview is not found");
	}
	if (!interview_result) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Interview Result is not found -- Service : Interview Get By Interview Id`));
		return _res.status(500).send("Interview Result is not found");
	}

	const currentTime = new Date();
	const interviewCreationTime = new Date(interview_result?.created_at);
	const [minutes, seconds] = interview.interview_time.split(":").map(Number);
	const totalInterviewTime = (minutes * 60 + seconds) * 1000;
	const elapsedTime = currentTime - interviewCreationTime;
	const is_interview_time_expired = elapsedTime > totalInterviewTime;
	if (interview_result.status === INTERVIEW_RESULT_STATUS_ENUM.REGISTERED || is_interview_time_expired) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Interview is already registered -- Service : Interview Get By Interview Id`));
		return _res.status(400).json({
			message: "Interview is already registered",
			status_code: "400",
			status: "success",
			data: interview_result,
		});
	}

	const diagram_questions = await Diagram_question_model.find({
		_id: {
			$in: interview.questions.diagram_question_list.map((item) => uuidBuffer.toString(item)),
		},
	});
	const algorithm_questions = await algorithm_question_model.find({
		_id: {
			$in: interview.questions.algorithm_question_list.map((item) => uuidBuffer.toString(item)),
		},
	});
	const test_questions = await test_question_model.find({
		_id: {
			$in: interview.questions.test_question_list.map((item) => uuidBuffer.toString(item)),
		},
	});
	const diagram_question_list = diagram_questions.map((item, index) => ({question: item, number: index, type: "Diagram"}));
	question_list.push(...diagram_question_list);
	const algorithm_question_list = algorithm_questions.map((item, index) => ({question: item, number: question_list.length + index, type: "Algorithm"}));
	question_list.push(...algorithm_question_list);
	const test_question_list = test_questions.map((item, index) => ({question: item, number: question_list.length + index, type: "Test"}));
	question_list.push(...test_question_list);
	const question_amount = diagram_questions.length + algorithm_questions.length + test_questions.length;

	let end_date = interview.end_date.split("-");
	end_date = new Date(end_date[2], end_date[1] - 1, end_date[0]);
	const reachable_time = Math.floor((new Date() - end_date) / 1000);
	let interview_share_link = jwt.sign({interview_id: interview._id}, process.env.INTERVIEW_SIGN_SECRET, {expiresIn: reachable_time});
	interview_share_link = `${_req.protocol}://${process.env.MAIN_ROUTE}/interview/signUp/${btoa(interview_share_link)}`;
	const read_interview_dto = {
		name: interview.name,
		description: interview.description,
		questions: question_list,
		interview_time: interview.interview_time,
		question_amount: question_amount,
		share_link: interview_share_link,
		interviewee_list: interview.interviewee_list,
	};

	return _res.status(200).json({
		message: "Interview is found",
		status_code: "200",
		status: "success",
		data: read_interview_dto,
	});
};

const get_by_interview_id = async (_req, _res) => {
	const interview = await interview_model.findById(_req.params.interview_id);
	let question_list = [];
	if (!interview) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Interview is not found -- Service : Interview Get By Interview Id`));
		return _res.status(500).send("Interview is not found");
	}

	const diagram_questions = await Diagram_question_model.find({
		_id: {
			$in: interview.questions.diagram_question_list.map((item) => uuidBuffer.toString(item)),
		},
	});
	const algorithm_questions = await algorithm_question_model.find({
		_id: {
			$in: interview.questions.algorithm_question_list.map((item) => uuidBuffer.toString(item)),
		},
	});
	const test_questions = await test_question_model.find({
		_id: {
			$in: interview.questions.test_question_list.map((item) => uuidBuffer.toString(item)),
		},
	});
	const diagram_question_list = diagram_questions.map((item, index) => ({question: item, number: index, type: "Diagram"}));
	question_list.push(...diagram_question_list);
	const algorithm_question_list = algorithm_questions.map((item, index) => ({question: item, number: question_list.length + index, type: "Algorithm"}));
	question_list.push(...algorithm_question_list);
	const test_question_list = test_questions.map((item, index) => ({question: item, number: question_list.length + index, type: "Test"}));
	question_list.push(...test_question_list);
	const question_amount = diagram_questions.length + algorithm_questions.length + test_questions.length;

	let end_date = interview.end_date.split("-");
	end_date = new Date(end_date[2], end_date[1] - 1, end_date[0]);
	const reachable_time = Math.floor((new Date() - end_date) / 1000);
	let interview_share_link = jwt.sign({interview_id: interview._id}, process.env.INTERVIEW_SIGN_SECRET, {expiresIn: reachable_time});
	interview_share_link = `${_req.protocol}://${process.env.MAIN_ROUTE}/interview/signUp/${btoa(interview_share_link)}`; //TODO: FİX THE HOST
	const read_interview_dto = {
		_id: interview._id,
		name: interview.name,
		description: interview.description,
		questions: question_list,
		interview_time: interview.interview_time,
		question_amount: question_amount,
		share_link: interview_share_link,
		interviewee_list: interview.interviewee_list,
		status: interview.status,
	};

	return _res.status(200).json({
		message: "Interview is found",
		status_code: "200",
		status: "success",
		data: read_interview_dto,
	});
};

const get_by_company_id = async (_req, _res) => {
	const interviews = await interview_model.find({
		company_list: _req.params.company_id,
	});

	const extracted_interviews = interviews.map((interview) => {
		return {
			id: interview._id,
			name: interview.name,
			start_date: interview.start_date,
			end_date: interview.end_date,
			question_amount: interview.questions.diagram_question_list.length + interview.questions.algorithm_question_list.length + interview.questions.test_question_list.length,
			interviewee_list: interview.interviewee_list,
			status: interview.status,
		};
	});

	if (!interviews) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Interviews are not found -- Service : Interview Get By Company Id`));
		return _res.status(500).send("Interviews are not found");
	}

	return _res.status(200).json({
		message: "Interviews are found",
		status_code: "200",
		status: "success",
		data: extracted_interviews,
	});
};
// get interviewees of an interview then get their details from  /individual_user/:individual_user_id from user_controller
//but interviewees are kept as buffer so we need to convert them to string
const get_interviewees = async (_req, _res) => {
	const interview = await interview_model.findById(_req.params.interview_id);
	if (!interview) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Interview Not Found -- Service : Interview Get Interviewees`));
		return _res.status(404).json({message: "Interview not found"});
	}
	const interviewees = interview.interviewee_list.map((interviewee) => uuidBuffer.toString(interviewee));
	// const interviewee_details = await user_controller.get_individual_user(
	//   interviewees
	// );
	//for every interviewee in interviewees, get their details from /individual_user/:individual_user_id
	let interviewee_details = [];
	for (let i = 0; i < interviewees.length; i++) {
		let interviewee = await Individual_User.findById(interviewees[i]);
		let interview_result = await interview_result_model.findOne({user_id: interviewees[i]});
		if (!interviewee) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Interviewee Not Found -- Service : Interview Get Interviewees`));
			return _res.status(404).json({message: "Interviewee not found"});
		}
		if (interview_result) {
			interview_result = {...interview_result.toObject(), user_id: interview_result.user_id.toString("hex"), interview_id: interview_result.interview_id.toString("hex")};
			interviewee = {...interviewee.toObject(), ...interview_result};
		}
		interviewee_details.push(interviewee);
	}

	return _res.status(200).json({
		message: "Interviewees are found",
		status_code: "200",
		status: "success",
		data: interviewee_details,
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
			const updatedInterview = await interview_model.findByIdAndUpdate(_req.params.interview_id, interview);
			if (updatedInterview) {
				console.info(chalk.bold(`${getTimestamp()} Status Code : 200 -- Message : Interview Updated -- Service : Interview Update`));
				return _res.status(200).json({
					message: "Interview Updated",
					status_code: "200",
					status: "success",
					data: updatedInterview,
				});
			} else {
				console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Interview is not updated -- Service : Interview Update`));
				return _res.status(500).json({message: "Interview is not updated"});
			}
		} else {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Interview Update`));
			return _res.status(404).json({message: "Question not found"});
		}
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Interview Update`));
		return _res.status(500).json({message: "Server Error"});
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
			return _res.status(404).json({message: "Interview not found"});
		}
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Interview Delete`));
		return _res.status(500).json({message: "Server Error"});
	}
};

//@desc Register user to interview
//@route POST /api/interview/register_user_to_interview/:interview_id
//@access Private
const register_user_to_interview = async (_req, _res) => {
	const pdfBuffer = fs.readFileSync(_req.file.path);

	const signed_interview_id = _req.interview_signature_info.interview_id;
	const interview = await interview_model.findById(signed_interview_id);

	if (!interview) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Interview Not Found -- Service : Register User To Interview`));
		return _res.status(404).json({message: "Interview not found"});
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
				status: "error",
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
		user_register_info.cover_letter = pdfBuffer;

		delete user_register_info.role;
		user_register_info.status = "ACTIVE";

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
				totp_secret_key: secret_key,
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
				status: "success",
			});
		} catch (error) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : ${error} -- Service : Register`));
			return _res.status(400).json({message: "Invalid User Data", status_code: "400", status: "error"});
		}
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 503 -- Error : ${error} -- Service : Register`));
		return _res.status(503).json({message: "Server Error", status_code: "503", status: "error"});
	}
};

const send_interview = async (_req, _res) => {
	try {
		const {interview_id, user_id_list} = _req.body;
		const interview = await interview_model.findOne({_id: interview_id});
		if (!interview) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Interview Not Found -- Service : Send Interview`));
			return _res.status(404).json({message: "Interview Not Found", status_code: "404", status: "error"});
		}
		if (user_id_list.length === 0) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : User List Not Found -- Service : Send Interview`));
			return _res.status(400).json({message: "User List Not Found", status_code: "400", status: "error"});
		}
		for (let i = 0; i < user_id_list.length; i++) {
			const user = await Individual_User.findOne({_id: user_id_list[i]});
			if (!user) {
				console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : User Not Found -- Service : Send Interview`));
				return _res.status(404).json({message: "User Not Found", status_code: "404", status: "error"});
			}
			if (interview.interviewee_list.includes(user._id)) {
				let end_date = interview.end_date.split("-");
				end_date = new Date(end_date[2], end_date[1] - 1, end_date[0]);
				const reachable_time = Math.floor((new Date() - end_date) / 1000);
				let interview_solve_link = jwt.sign({user_id: user._id, interview_id: interview._id}, process.env.INTERVIEW_PLAYGROUND_SIGN_SECRET, {expiresIn: reachable_time});
				interview_solve_link = `${_req.protocol}://${process.env.MAIN_ROUTE}/interview/login/${btoa(interview_solve_link)}`;
				send_email(user.email, "Interview Link", "interview_solve_link", interview_solve_link);
			} else {
				console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : User ${user._id} Not Found In Interview -- Service : Send Interview`));
			}
		}
		return _res.status(200).json({message: "Interview Sent", status_code: "200", status: "success"});
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 503 -- Error : ${error} -- Service : Send Interview`));
		return _res.status(503).json({message: "Server Error", status_code: "503", status: "error"});
	}
};

const login_user_to_interview = async (_req, _res) => {
	try {
		let is_user_available = "";
		let is_password_match = "";
		let user_id_field = "individual_user_id";
		//----- Input Check
		if (_req.body.email === "" || _req.body.password === "" || _req.body.terms === "") {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Email or Password or Terms Not Found -- Service : Login To Interview`));
			return _res.status(400).send({message: "Email or Password or Terms Not Found", status_code: "400", status: "error"});
		}
		//----- User Exist Check
		try {
			is_user_available = await Common_User.findOne({email: _req.body.email});
			if (!is_user_available) throw new Error("User Not Found");
		} catch (error) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : ${error} : Email -- Service : Login To Interview`));
			return _res.status(401).json({message: "Invalid Credentials", status_code: "401", status: "error"});
		}

		//----- User Check
		try {
			const check_user_availability = await Individual_User.findOne({email: _req.body.email});
			if (!check_user_availability) throw new Error("User Not Found In Related DB");
			is_user_available = {is_user_available, check_user_availability};
		} catch (error) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : ${error} -- Service : Login To Interview`));
			return _res.status(401).json({message: "Invalid Credentials", status_code: "401", status: "error"});
		}

		//----- User Status Check
		if (is_user_available.check_user_availability.status !== "ACTIVE") {
			const query = {};
			query[user_id_field] = is_user_available.check_user_availability._id;

			console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : User is not active -- Service : Login -- ID : ${is_user_available.is_user_available.email}`));
			return _res.status(401).json({message: "User is not active", status_code: "401", status: "error"});
		}

		//----- DB Access Type Check
		try {
			const query = {};
			query[user_id_field] = is_user_available.check_user_availability._id;
			const is_user_refresh_token_available = await Auth.findOne({...query});
			if (is_user_refresh_token_available) throw new Error("User Already Logged In");
		} catch (error) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : ${error} -- Service : Login To Interview`));
			return _res.status(401).json({message: "User Already Logged In", status_code: "401", status: "error"});
		}

		//----- Password Check
		try {
			is_password_match = await bcrypt.compare(Buffer.from(_req.body.password, "utf-8"), is_user_available.check_user_availability.password);
			if (!is_password_match) throw new Error("Password Not Match");
		} catch (error) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : ${error} -- Service : Login To Interview`));
			return _res.status(401).json({
				message: "Invalid Credentials : Password",
				status_code: "401",
				status: "error",
			});
		}
		// Controll Log In user is same with tokenized info
		if (is_user_available.check_user_availability._id !== _req.interview_signature_info.user_id) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : User ${is_user_available.check_user_availability._id} Not Found In Interview -- Service : Login To Interview`));
			return _res.status(401).json({message: "User Not Found In Interview", status_code: "401", status: "error"});
		}

		const interview = await interview_model.findOne({_id: _req.interview_signature_info.interview_id});
		if (!interview.interviewee_list.includes(is_user_available.check_user_availability._id)) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : User ${is_user_available.check_user_availability._id} Not Found In Interview -- Service : Login To Interview`));
			return _res.status(401).json({message: "User Not Found In Interview", status_code: "401", status: "error"});
		}
		const interview_time = parseInt(interview.interview_time.split(":")[0]) + 10 + "m";

		//----- IF Interview Time is Over or Already Completed
		// const interview_result = await interview_result_model.findOne({interview_id: _req.interview_signature_info.interview_id, user_id: _req.interview_signature_info.user_id});
		// if (interview_result) {
		// 	const currentTime = new Date();
		// 	const interviewCreationTime = new Date(interview_result.created_at);
		// 	const [minutes, seconds] = interview.interview_time.split(":").map(Number);
		// 	const totalInterviewTime = (minutes * 60 + seconds) * 1000;
		// 	const elapsedTime = currentTime - interviewCreationTime;
		// 	const is_interview_time_expired = elapsedTime > totalInterviewTime;
		// 	if ((interview_result.status === INTERVIEW_RESULT_STATUS_ENUM.REGISTERED || interview_result.status?.name === INTERVIEW_RESULT_STATUS_ENUM.REGISTERED) || is_interview_time_expired) {
		// 		console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Interview is already registered -- Service : Interview Get By Interview Id`));
		// 		return _res.status(400).json({
		// 			message: "Interview is already registered",
		// 			status_code: "400",
		// 			status: "success",
		// 			data: interview_result,
		// 		});
		// 	}
		// }

		//----- JWT Token Create
		const access_token = jwt.sign(
			{
				user_id: _req.interview_signature_info.user_id,
				interview_id: _req.interview_signature_info.interview_id,
			},
			process.env.ACCESS_TOKEN_SECRET,
			{expiresIn: "1m"}
		);

		const refresh_token = jwt.sign(
			{
				user_id: _req.interview_signature_info.user_id,
				interview_id: _req.interview_signature_info.interview_id,
			},
			process.env.REFRESH_TOKEN_SECRET,
			{expiresIn: interview_time}
		);

		//----- Token Save to DB & Cookie Set & Response
		try {
			const query = {};
			query[user_id_field] = is_user_available.check_user_availability._id;
			const delay_time = 2;
			const current_user = {...query, refresh_token: refresh_token, expire_at: new Date(Date.now() + (parseInt(interview.interview_time.split(":")[0]) + delay_time) * 60 * 1000)};
			const maxAgeInMilliseconds = (parseInt(interview.interview_time.split(":")[0]) * 60 + 10) * 1000;

			const auth_result = await Auth.create(current_user);
			if (!auth_result) throw new Error("Auth DB Error");
			_res.cookie("refresh_token", refresh_token, {
				maxAge: maxAgeInMilliseconds,
				sameSite: "None",
				//domain: "the-pure.tech",
				secure: true, // "true" yerine "true" olarak ayarlanmalı
				httpOnly: true, // "true" yerine "true" olarak ayarlanmalı
			});
			_res.cookie("access_token", access_token, {
				maxAge: 60 * 1000, // 1 minute
				sameSite: "None",
				//domain: "the-pure.tech",
				secure: true, // "true" yerine "true" olarak ayarlanmalı
				httpOnly: true, // "true" yerine "true" olarak ayarlanmalı
			});
			const is_interview_result_exist = await interview_result_model.findOne({user_id: _req.interview_signature_info.user_id, interview_id: _req.interview_signature_info.interview_id});
			if (!is_interview_result_exist) {
				const initiate_interview_result = await interview_result_model.create({user_id: _req.interview_signature_info.user_id, interview_id: _req.interview_signature_info.interview_id});
				if (!initiate_interview_result) {
					console.error(chalk.bold(`${getTimestamp()} Status Code : 503 -- Error : Interview Result DB Error -- Service : Login To Interview`));
					return _res.status(503).json({message: "Server Error", status_code: "503", status: "error"});
				}
			}
			if (is_interview_result_exist) {
				const currentTime = new Date();
				const interviewCreationTime = new Date(is_interview_result_exist.created_at);
				const [minutes, seconds] = interview.interview_time.split(":").map(Number);
				const totalInterviewTime = (minutes * 60 + seconds) * 1000;
				const elapsedTime = currentTime - interviewCreationTime;
				const is_interview_time_expired = elapsedTime > totalInterviewTime;
				if ((is_interview_result_exist.status === INTERVIEW_RESULT_STATUS_ENUM.REGISTERED ||is_interview_result_exist.status?.name === INTERVIEW_RESULT_STATUS_ENUM.REGISTERED) || is_interview_time_expired) {
					console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Interview is already registered -- Service : Interview Get By Interview Id`));
					return _res.status(400).json({
						message: "Interview is already registered",
						status_code: "400",
						status: "success",
						data: is_interview_result_exist,
					});
				}
			}


			console.info(chalk.green.bold(`${getTimestamp()} Status Code : 200 -- Info : User Authenticated -- ID : ${is_user_available.check_user_availability._id}`));
			return _res.status(200).json({
				message: "User Authenticated",
				status_code: "200",
				status: "success",
				data: {
					interview_status: is_interview_result_exist?.status || INTERVIEW_RESULT_STATUS_ENUM.INITIATED,
				},
			});
		} catch (error) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : ${error} -- Service : Login To Interview`));
			return _res.status(404).json({message: "Invalid Auth Data", status_code: "404", status: "error"});
		}
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 503 -- Error : ${error} -- Service : Login To Interview`));
		return _res.status(503).json({message: "Server Error", status_code: "503", status: "error"});
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
//@route GET /api/interview/get_result/:user_id/:interview_id
//@access Private
const get_result_by_user_id_interview_id = async (_req, _res) => {
	const {interview_id, user_id} = _req.params;
	const interview_result = await interview_result_model.findOne({interview_id, user_id});
	if (!interview_result) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Interview Result Not Found -- Service : Get Result By User Id`));
		return _res.status(404).json({message: "Interview Result Not Found", status_code: "404", status: "error"});
	}
	return _res.status(200).json({message: "Interview Result Found", status_code: "200", status: "success", data: interview_result});
};

const get_result_by_interview_signature = async (_req, _res) => {
	const {interview_id, user_id} = _req.interview_signature_info;

	let interview_result = await interview_result_model.findOne({interview_id, user_id});
	const interview = await interview_model.findById({_id: interview_id});
	if (!interview_result) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Interview Result Not Found -- Service : Get Result By Interview Signature`));
		return _res.status(404).json({message: "Interview Result Not Found", status_code: "404", status: "error"});
	}
	interview_result = {...interview_result.toObject(), interview_name: interview.name};
	return _res.status(200).json({message: "Interview Result Found", status_code: "200", status: "success", data: interview_result});
};

const update_result_status = async (_req, _res) => {
	const {interview_id, user_id, status_name} = _req.body;
	let interview_result = await interview_result_model.findOne({interview_id, user_id});
	if (!interview_result) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Interview Result Not Found -- Service : Update Result Status`));
		return _res.status(404).json({message: "Interview Result Not Found", status_code: "404", status: "error"});
	}
	let date_updated_enum = {...INTERVIEW_RESULT_STATUS_ENUM[status_name]};
	if (_req.body?.date) {
		date_updated_enum.update_date = formatDate(new Date());
		date_updated_enum.communication_date = _req.body?.date;
	} else {
		date_updated_enum.update_date = formatDate(new Date());
	}

	interview_result = {...interview_result.toObject(), status: date_updated_enum};
	await interview_result_model.findByIdAndUpdate(interview_result._id, interview_result);

	return _res.status(200).json({message: "Interview Result Updated", status_code: "200", status: "success", data: interview_result});
};

function formatDate(date) {
	const options = {day: "2-digit", month: "short", year: "numeric"};
	return date.toLocaleDateString("en-US", options);
}

const finish_interview = async (_req, _res) => {
  //YAPILDI---- dbden sorulari cekip kontrol et idleri ile
  //YAPILDI---- interview result model e hangi sorunun dogru , yanlis oldugunu kaydet
  //YAPILDI---- inteview score da kaydedilecek
  //YAPILDI---- Redirect ederken cors hatasi aliyor
  try {
    const interview_signature = _req.body.interview_signature;
    const user_answers = _req.body.user_answers;

    let decoded;
    try {
      decoded = jwt.verify(
        atob(interview_signature),
        process.env.INTERVIEW_PLAYGROUND_SIGN_SECRET
      );
    } catch (err) {
      console.error(chalk.red.bold("Error decoding the interview signature"));
      throw err;
    }

    const { interview_id, user_id } = decoded;

    let interview;
    try {
      interview = await interview_model.findById(interview_id);
    } catch (err) {
      console.error(chalk.red.bold("Error finding the interview by id"));
      throw err;
    }

    let user;
    try {
      user = await Individual_User.findById(user_id);
    } catch (err) {
      console.error(chalk.red.bold("Error finding the user by id"));
      throw err;
    }

    let questions = [];
    try {
      for (let user_answer of user_answers) {
        let question, questionObj;

        switch (user_answer.type) {
          case "Test":
            question = await test_question_model.findById(user_answer._id);
            questionObj = question.toObject();
            questionObj.isTrue = questionObj.answer === user_answer.user_answer;
            questions.push(questionObj);
            break;
          case "Diagram":
            question = await diagram_question_model.findById(user_answer._id);
            questionObj = question.toObject();

            questionObj.isTrue = questionObj.answer === user_answer.user_answer;
            questions.push(questionObj);
            break;
          case "Algorithm":
            question = await algorithm_question_model.findById(user_answer._id);
            questionObj = question.toObject();

            questionObj.isTrue =
              questionObj.answer[user_answer.language] ===
              user_answer.user_answer;
            questions.push(questionObj);
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error(chalk.red(error));
    }
	const score = (100 / questions.length) * questions.filter((question) => question.isTrue).length;
    //save the interview_result to db
    const interview_result = await interview_result_model.findOne({
      interview_id,
      user_id,
    });
    if (!interview_result) {
      console.error(
        chalk.bold(
          `${getTimestamp()} Status Code : 500 -- Error : Interview Result is not found -- Service : Interview Get By Interview Id`
        )
      );
      return _res.status(500).json({
        message: "Interview Result is not found",
        status_code: "500",
        status: "error",
      });
    }
    interview_result.interview_score = score.toFixed(2);
    interview_result.status = INTERVIEW_RESULT_STATUS_ENUM.REGISTERED;
    interview_result.questions = questions;
    await interview_result.save();
    
	return _res.status(200).json({
	  message: "Interview is finished",
	  status_code: "200",
	  status: "success",
	  data: {
		redirect_path: `/interview/tracker/${interview_signature}`,
	  },
	});
    
  } catch (err) {
    console.error(chalk.red.bold("Error finishing the interview"), err);
    return _res.status(500).json({
      message: "Error finishing the interview",
      status_code: "500",
      status: "error",
    });
  }
};


export default {
	get_all_interview,
	add_interview,
	get_by_interview_id,
	get_by_interview_signature,
	update_interview,
	delete_interview,
	get_all_result,
	add_result,
	get_by_interview_result_id,
	update_result,
	delete_result,
	get_result_by_user_id_interview_id,
	get_by_company_id,
	register_user_to_interview,
	send_interview,
	get_interviewees,
	login_user_to_interview,
	get_result_by_interview_signature,
	update_result_status,
	finish_interview
};
