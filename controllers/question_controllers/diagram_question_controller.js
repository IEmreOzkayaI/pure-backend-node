import diagram_question_model from "../../models/questionModels/diagram_question_model.js";
import diagram_question_result_model from "../../models/questionModels/diagram_question_result_model.js";
import chalk from "chalk";
import getTimestamp from "../../utils/time_stamp.js";
import Level_model from "../../models/level_model.js";

// @desc    Add new diagram question
// @route   POST /api/question/add_diagram
// @access  Private
const add_diagram = async (_req, _res) => {
	if (!_req.body.level) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level is required -- Service : Diagram Add`));
		return _res.status(400).send("Level is required");
	}
	const level_id = await Level_model.findOne({_id: _req.body.level});
	if (!level_id) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level is not found -- Service : Diagram Add`));
		return _res.status(400).send("Level is not found");
	}

	const diagram_question = await diagram_question_model.create({
		name: _req.body.name,
		topic: _req.body.topic,
		level: _req.body.level,
		real_life_application: _req.body.real_life_application,
		description: _req.body.description,
		answer: _req.body.answer,
		answer_explanation: _req.body.answer_explanation,
		additional_resources_about_topic: _req.body.additional_resources_about_topic,
		interactive_steps: _req.body.interactive_steps,
	});

	if (!diagram_question) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Diagram question is not created -- Service : Diagram Add`));
		return _res.status(500).send("Diagram question is not created");
	}

	return _res.status(200).json({
		message: "Diagram Question Created",
		status_code: "200",
		status: "success",
	});
};

// @desc    Get all diagram questions
// @route   GET /api/question/get_all_diagram
// @access  Private
const get_all_diagram = async (_req, _res) => {
	try {
		const questions = await diagram_question_model.find({});
		if (!questions) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Questions Not Found -- Service : Diagram Get All`));
			return _res.status(404).json({message: "Questions not found"});
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
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Diagram Get All`));
		return _res.status(500).json({message: "Server Error"});
	}
};

// @desc    Get diagram question
// @route   GET /api/question/get_diagram_question_part_by_id/:diagram_id
// @access  Private
const get_diagram_question_part_by_id = async (_req, _res) => {
	try {
		const question = await diagram_question_model.findById(_req.params.diagram_id);
		if (question) {
			const level = await Level_model.findById(question.level);
			if (level) {
				question.level = level;
				const read_diagram_dto = {
					_id: question._id,
					name: question.name,
					topic: question.topic,
					level: question.level.name,
					description: question.description,
					real_life_application: question.real_life_application,
					additional_resources_about_topic: question.additional_resources_about_topic,
					interactive_steps: question.interactive_steps,
				};
				return _res.json(read_diagram_dto);
			} else {
				console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Level Not Found -- Service : Diagram Get By Id`));
				return _res.status(404).json({message: "Level not found"});
			}
		} else {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Diagram Get By Id`));
			return _res.status(404).json({message: "Question not found"});
		}
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Diagram Get By Id`));
		return _res.status(500).json({message: "Server Error"});
	}
};

// @desc    Get diagram question
// @route   GET /api/question/get_diagram_answer_part_by_id/:diagram_id
// @access  Private
const get_diagram_answer_part_by_id = async (_req, _res) => {
	try {
		const question = await diagram_question_model.findById(_req.params.diagram_id);
		if (question) {
			const level = await Level_model.findById(question.level);
			if (level) {
				question.level = level;
				const read_diagram_dto = {
					_id: question._id,
					answer: question.answer,
					answer_explanation: question.answer_explanation,
				};
				return _res.json(read_diagram_dto);
			} else {
				console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Level Not Found -- Service : Diagram Get By Id`));
				return _res.status(404).json({message: "Level not found"});
			}
		} else {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Diagram Get By Id`));
			return _res.status(404).json({message: "Question not found"});
		}
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Diagram Get By Id`));
		return _res.status(500).json({message: "Server Error"});
	}
};

// @desc    Update diagram question
// @route   PUT /api/question/update_diagram/:diagram_id
// @access  Private
const update_diagram = async (_req, _res) => {
	try {
		const question = await diagram_question_model.findById(_req.params.diagram_id);
		if (question) {
			// Update the question
			Object.assign(question, _req.body);
			const updatedQuestion = await diagram_question_model.findByIdAndUpdate(_req.params.diagram_id, question, {
				new: true,
				runValidators: true,
			});
			if (updatedQuestion) {
				console.log(chalk.bold(`${getTimestamp()} Status Code : 200 -- Message : Diagram Updated -- Service : Diagram Update`));
				return _res.status(200).json({
					message: "Diagram Updated",
					status_code: "200",
					status: "success",
					data: updatedQuestion,
				});
			} else {
				console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Diagram is not updated -- Service : Diagram Update`));
				return _res.status(500).json({message: "Diagram is not updated"});
			}
		} else {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Diagram Update`));
			return _res.status(404).json({message: "Question not found"});
		}
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Diagram Update`));
		return _res.status(500).json({message: "Server Error"});
	}
};

// @desc    Delete diagram question
// @route   DELETE /api/question/delete_diagram/:diagram_id
// @access  Private
const delete_diagram = async (_req, _res) => {
	try {
		const question = await diagram_question_model.findById(_req.params.diagram_id);
		if (question) {
			await diagram_question_model.findByIdAndDelete(_req.params.diagram_id);
			return _res.json({message: "Question removed"});
		} else {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Diagram Delete`));
			return _res.status(404).json({message: "Question not found"});
		}
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Diagram Delete`));
		return _res.status(500).json({message: "Server Error"});
	}
};

// @desc    Get diagram question by level
// @route   GET /api/question/get_diagram/:level_id
// @access  Private
const get_diagram_by_level = async (_req, _res) => {
	try {
		const level = await Level_model.findById(_req.params.level_id);
		if (!level) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Level Not Found -- Service : Diagram Get By Level`));
			return _res.status(404).json({message: "Level not found"});
		}
		const questions = await diagram_question_model.find({level_id: _req.params.level_id});
		if (!questions) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Questions Not Found -- Service : Diagram Get By Level`));
			return _res.status(404).json({message: "Questions not found"});
		}
		return _res.json(questions);
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Diagram Get By Level`));
		return _res.status(500).json({message: "Server Error"});
	}
};

const save_diagram_answer = async (_req, _res) => {
	try {
		const diagram_question = await diagram_question_model.findById(_req.params.diagram_id);
		if (!diagram_question) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Save Diagram Answer`));
			return _res.status(404).json({message: "Question not found"});
		}

		const is_result_exist = await diagram_question_model.findOne({diagram_question_id: _req.params.diagram_id, user_id: _req.user._id});
		if (is_result_exist) {
			const try_count = is_result_exist.try_count + 1;
			const result = await diagram_question_result_model.findByIdAndUpdate(is_result_exist._id, {
				user_answer: _req.body.user_answer,
				is_correct: diagram_question.answer === _req.body.user_answer,
				try_count: try_count,
			});
			return _res.status(200).json({
				message: "Diagram Answer Updated",
				status_code: "200",
				status: "success",
				data: result,
			});
		}

		const result = await diagram_question_result_model.create({
			diagram_question_id: _req.params.diagram_id,
			user_id: _req.user._id,
			user_answer: _req.body.user_answer,
			is_correct: diagram_question.answer === _req.body.user_answer,
			try_count: 1,
		});

		return _res.status(200).json({
			message: "Diagram Answer Saved",
			status_code: "200",
			status: "success",
			data: result,
		});
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error} -- Service : Diagram Answer`));
		return _res.status(500).json({message: "Server Error"});
	}
};

const diagram_question_controller = {
	add_diagram,
	get_all_diagram,
	get_diagram_question_part_by_id,
	get_diagram_answer_part_by_id,
	update_diagram,
	delete_diagram,
	get_diagram_by_level,
    save_diagram_answer,
};
export default diagram_question_controller;
