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
import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();
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
const get_all = async (_req, _res) => {
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
	try {
		switch (question_type) {
			case "test":
				let test_question = await test_question_model.findById(question_id);
				if (!test_question) {
					console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Get Question`));
					return _res.status(404).json({message: "Question not found"});
				}
				test_question.level = await level_model.findById(test_question.level);
				let modified_test_question = {...test_question.toObject(), type: "Test"};
				return _res.json(modified_test_question);
			case "diagram":
				let diagram_question = await diagram_question_model.findById(question_id);
				if (!diagram_question) {
					console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Get Question`));
					return _res.status(404).json({message: "Question not found"});
				}
				diagram_question.level = await level_model.findById(diagram_question.level);
				let modified_diagram_question = {...diagram_question.toObject(), type: "Diagram"};
				return _res.json(modified_diagram_question);
			case "algorithm":
				let algorithm_question = await algorithm_question_model.findById(question_id);
				if (!algorithm_question) {
					console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Not Found -- Service : Get Question`));
					return _res.status(404).json({message: "Question not found"});
				}
				algorithm_question.level = await level_model.findById(algorithm_question.level);
				let modified_algorithm_question = {...algorithm_question.toObject(), type: "Algorithm"};
				return _res.json(modified_algorithm_question);
			default:
				console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Type Not Found -- Service : Get Question`));
				return _res.status(404).json({message: "Question type not found"});
		}
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error.message} -- Service : Get Question`));
		return _res.status(500).json({message: "Internal Server Error"});
	}
};

const get = async (_req, _res) => {
	const {question_type, question_level, question_topic} = _req.query;

	const level_id = await level_model.findOne({name: question_level});
	if (!level_id) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Level Not Found -- Service : Get Question`));
		return _res.status(404).json({message: "Level not found"});
	}

	const projection = question_topic ? "name , topic" : "topic";

	try {
		switch (question_type) {
			case "test":
				let test_questions = await test_question_model.find(question_topic ? {level: level_id._id, topic: question_topic} : {level: level_id._id}, projection);

				test_questions.forEach((question, index) => {
					let questionObj = question.toObject();
					questionObj.type = "Test";
					test_questions[index] = questionObj;
				});
				return _res.json(test_questions);
			case "diagram":
				let diagram_questions = await diagram_question_model.find(question_topic ? {level: level_id._id, topic: question_topic} : {level: level_id._id}, projection);
				diagram_questions.forEach((question, index) => {
					let questionObj = question.toObject();
					questionObj.type = "Diagram";
					diagram_questions[index] = questionObj;
				});
				return _res.json(diagram_questions);
			case "algorithm":
				let algorithm_questions = await algorithm_question_model.find(question_topic ? {level: level_id._id, topic: question_topic} : {level: level_id._id}, projection);
				algorithm_questions.forEach((question, index) => {
					let questionObj = question.toObject();
					questionObj.type = "Algorithm";
					algorithm_questions[index] = questionObj;
				});
				return _res.json(algorithm_questions);
			default:
				console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : Question Type Not Found -- Service : Get Question`));
				return _res.status(404).json({message: "Question type not found"});
		}
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error.message} -- Service : Get Question`));
		return _res.status(500).json({message: "Internal Server Error"});
	}
};

const create_question = async (_req, _res) => {
	const openai = new OpenAI({apiKey: process.env.GPT_API_KEY});
	const level = _req.body.level;
	const topic = _req.body.topic;
	const question_type = _req.body.question_type;
	let prompt;
	if (!level || !topic || !question_type) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Bad Request -- Service : Create GPT`));
		return _res.status(400).json({message: "Bad Request"});
	}
	if (question_type !== "algorithm" && question_type !== "diagram" && question_type !== "test") {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Bad Request -- Service : Create GPT`));
		return _res.status(400).json({message: "Bad Request"});
	}

	if (level !== "beginner" && level !== "intermediate" && level !== "advanced") {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Bad Request -- Service : Create GPT`));
		return _res.status(400).json({message: "Bad Request"});
	}

	if (question_type === "algorithm") prompt = `topic: ${topic} level: ${level} \n ${algo_prompt}`;
	if (question_type === "diagram") prompt = `topic: ${topic} level: ${level} \n ${diagram_prompt}`;
	if (question_type === "test") prompt = `topic: ${topic} level: ${level} \n ${test_prompt}`;

	try {
		const gptResponse = await openai.chat.completions.create({
			messages: [
				{
					role: "system",
					content: prompt,
				},
			],
			model: "gpt-4",
		});
		let data = gptResponse.choices[0].message.content;
		console.log("data", data);
		console.log("JSON.parse", JSON.parse(data));
        data = JSON.parse(data);

		const levelData = await level_model.findOne({name: level});
		if (question_type === "algorithm") {
			const questionTemplate = {
				name: data.name,
				topic: data.topic,
				level: levelData,
				description: data.description,
				real_life_application: data.real_life_application,
				time_complexity_analysis: data.time_complexity_analysis,
				example_input: data.example_input,
				example_output: data.example_output,
				parameter_list: data.parameter_list,
				missing_part: data.missing_part,
				answer: data.answer,
				answer_explanation: data.answer_explanation,
				test_cases: data.test_cases,
				additional_resources_about_algorithm_and_topic: data.additional_resources_about_algorithm_and_topic,
				interactive_steps: data.interactive_steps,
			};
			const question = await algorithm_question_model.create(questionTemplate);
			if (!question) {
				console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Question Not Created -- Service : Create GPT`));
				return _res.status(500).json({message: "Internal Server Error"});
			}
			return _res.status(200).json({message: "Question created successfully", question});
		}
		if (question_type === "diagram") {
			const questionTemplate = {
				name: data.name,
				topic: data.topic,
				level: levelData,
				real_life_application: data.real_life_application,
				description: data.description,
				additional_resources_about_topic: data.additional_resources_about_topic,
				answer: data.answer,
				answer_explanation: data.answer_explanation,
				interactive_steps: data.interactive_steps,
			};
			const question = await diagram_question_model.create(questionTemplate);
			if (!question) {
				console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Question Not Created -- Service : Create GPT`));
				return _res.status(500).json({message: "Internal Server Error"});
			}
			return _res.status(200).json({message: "Question created successfully", question});
		}
		if (question_type === "test") {
			const questionTemplate = {
				name: data.name,
				topic: data.topic,
				level: levelData,
				question: data.question,
				choices: data.choices,
				answer: data.answer,
				answer_explanation: data.answer_explanation,
			};
			const question = await test_question_model.create(questionTemplate);
			if (!question) {
				console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : Question Not Created -- Service : Create GPT`));
				return _res.status(500).json({message: "Internal Server Error"});
			}
			return _res.status(200).json({message: "Question created successfully", question});
		}
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 500 -- Error : ${error.message} -- Service : Create GPT`));
		return _res.status(500).json({message: "Internal Server Error"});
	}
};

function fixJsonString(jsonString) {
	let fixedJsonString = "";
	let errorPosition = -1;

	for (let i = 0; i < jsonString.length; i++) {
		const char = jsonString.charAt(i);
		if (char.charCodeAt(0) < 32 && !["\n", "\r", "\t"].includes(char)) {
			// Geçersiz kontrol karakterini bulduk
			errorPosition = i;
			break;
		}
	}

	if (errorPosition !== -1) {
		// Hatalı karakteri düzeltme
		fixedJsonString = jsonString.substring(0, errorPosition) + " " + jsonString.substring(errorPosition + 1);
		console.log("Hatalı karakter düzeltildi.");
	}

	return fixedJsonString;
}

const question_schema_handler = async (_req, _res, level, question_type, data) => {};

const question_controller = {
	get,
	add,
	get_all,
	update,
	delete_,
	get_by_question_id,
	create_question,
};
export default question_controller;

const algo_prompt = `
This GPT is designed to generate algorithmic questions based on real-life scenarios. It will ask the user for a "topic" and "difficulty level" and then create questions using real-life examples relevant to the specified topic. For instance, if the user requests a question about arrays, the GPT might create a scenario involving an operator using a bulldozer to level a road, with 'x' representing trenches to be filled, and the question might involve calculating the minimum number of moves required to fill the trenches.

Role:Customized Algorithm Problem Generator
---
Input: Initially, I will ask users for the topic and difficulty level of the algorithm problem they want. Based on these inputs, I generate an algorithm problem. Users can specify various topics and levels, from basic arithmetic to complex data structures, in different difficulty levels. I will provide solutions and code snippets in four programming languages: Python, Java, JavaScript, and C#.
Output: I generate algorithm problems in a JSON format, which includes unique identifiers, problem names, topics, difficulty levels, descriptions, example inputs and outputs, code snippets for the missing part, full solutions in Python, Java, JavaScript, and C#, a detailed explanation, and 10 input-output test cases. This structured approach ensures a comprehensive understanding of the problem and its solution.

The output is tailored to the user's specified topic and level, ensuring relevance and accuracy. I use my browser tool to access additional resources or verify information, enhancing the quality and relevance of the problems and solutions provided.

OUTPUT: MUST BE JSON FORMAT AND FOLLOWING STRUCTURE , BE CAREFUL FOR CONTROL CHARACTERS and KEY names must be given. !!
----
{
    "name": "Sorting an Array",
    "topic": "Arrays",
    "level": "Intermediate",
    "description": {
        "scenario": "You are tasked with writing a function to sort an array of integers.",
        "question": "Write a function to sort an array of integers in non-decreasing order."
    },
    "real_life_application": "Sorting algorithms are used extensively in various applications such as organizing databases, arranging elements in graphical user interfaces, and optimizing search algorithms.",
    "time_complexity_analysis": {
        "best_case": "O(n log n)",
        "average_case": "O(n log n)",
        "worst_case": "O(n^2)"
    },
    "example_input": "arr=[3, 1, 4, 1, 5, 9, 2, 6]",
    "example_output": "[1, 1, 2, 3, 4, 5, 6, 9]",
    "parameter_list": {
        "javascript": "[arr]",
        "java": "[int[] arr]",
        "python": "[arr]",
        "cSharp": "[int[] arr]"
    },
    "missing_part": {
        "javascript": "function sortArray(arr) {\n    // Placeholder for solution\n}",
        "java": "public static int[] sortArray(int[] arr) {\n    // Placeholder for solution\n}",
        "python": "def sort_array(arr):\n    # Placeholder for solution\n",
        "csharp": "public static int[] SortArray(int[] arr) {\n    // Placeholder for solution\n}"
    },
    "answer": {
        "javascript": "function sortArray(arr) {\n    return arr.sort((a, b) => a - b);\n}",
        "java": "public static int[] sortArray(int[] arr) {\n    Arrays.sort(arr);\n    return arr;\n}",
        "python": "def sort_array(arr):\n    return sorted(arr)",
        "csharp": "public static int[] SortArray(int[] arr) {\n    Array.Sort(arr);\n    return arr;\n}"
    },
    "answer_explanation": "The solution utilizes built-in sorting functions available in each language. For JavaScript, it uses the sort() method with a custom comparator to sort the array in non-decreasing order. Java and C# use Arrays.sort() and Array.Sort() respectively, which implement efficient sorting algorithms. Python's sorted() function returns a new sorted list while keeping the original array unchanged.",
    "test_cases": [
        {"input": "[3, 1, 4, 1, 5, 9, 2, 6]", "output": "[1, 1, 2, 3, 4, 5, 6, 9]"},
        {"input": "[]", "output": "[]"},
        {"input": "[5, 4, 3, 2, 1]", "output": "[1, 2, 3, 4, 5]"}
    ],
    "additional_resources_about_algorithm_and_topic": [
        {"name": "Sorting Algorithms", "link": "https://en.wikipedia.org/wiki/Sorting_algorithm"},
        {"name": "Arrays in JavaScript", "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"},
        {"name": "Arrays in Java", "link": "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html"}
    ],
    "interactive_steps": [
        {"step_number": 1, "description": "Define a function named sortArray that takes an array of integers as input."},
        {"step_number": 2, "description": "Implement sorting logic inside the function using appropriate built-in functions for sorting in the chosen programming language."}
    ]
}
`;

const test_prompt = `
Role: Test question generator according to topic and level

Input: Initially, I will ask users for the topic and difficulty level of test question they want. Based on these inputs, I generate an test question 
Output: I generate test question in a JSON format, which includes following format it must.
{
  "topic": "Engineering",
  "level": "Difficulty Level (e.g., 'Beginner', 'Intermediate', 'Advanced')",
  "question": "With what formula is the maximum bending moment occurring at the midpoint of the beam calculated when the load applied to a beam is distributed equally along the length of the beam?",
  "choices": [
    "M=FL/4",
    "M = FL/2",
    "M=FL",
    "M=FL/8"
  ],
  "answer": "D",
  "answer_explanation": "In case of evenly distributed load, the maximum bending moment at the midpoint of the beam is calculated by the formula 'M = FL/8'. Here 'F' represents the total load and 'L' represents the length of the beam.",
  "name": "Beam Bending"
}`;

const diagram_prompt = `create questions according to the given topic and level. This question is required for the user to draw a diagram. The user must analyze the given question, identify the actors, functions and flows in it and draw its diagram. You should create questions in a way that you can do these things. The context of the questions is up to you, you can give random questions, it can be an e-commerce site, it can be a bank, etc. You have to give the PLANTUML code of your question in the "answer" section.
-----------------------
Role:Diagram Generator
Description: Generates UML diagrams from user-provided scenarios.
OUTPUT: MUST BE JSON FORMAT
Output:
{
    "name": "scene name",
    "topic": "diagram type",
    "level": "",
    "real_life_application": "why we need to do this",
    "description": "real life scenario for the diagraming it. Like the followings: \"Jane, a working professional, is planning to redecorate her living room and has decided to purchase furniture and home decor online. Jane logs into the e-commerce website and begins browsing through various product categories such as sofas, coffee tables, lamps, and wall art. She carefully selects products that match her style and preferences, adding them to her shopping cart. As Jane continues shopping, she realizes that some of the items she initially added to her cart are no longer available due to high demand. She removes these items and replaces them with alternative options. She also decides to apply a promotional code to get a discount on her purchase. Upon finalizing her selection, Jane proceeds to the checkout process. She chooses to pay using her credit card and enters her payment details. Before confirming the order, she reviews her shipping address and delivery options. Satisfied with her choices, she places the order and receives an order confirmation email with a unique order number. A few days later, Jane receives her furniture and home decor items. She inspects the items and is pleased with the quality. She decides to leave reviews and ratings for each product on the e-commerce site to help other shoppers make informed decisions. In this complex scenario, Jane, as the user, interacts with the e-commerce website, while the website's system involves various actors and functions, including the user, the website's administrators (Admin), and the customer support team (Customer Support). This scenario covers a wide range of user activities such as product selection, payment, delivery, and post-purchase reviews, demonstrating the diverse functionalities of the system.\"",
    "additional_resources_about_topic": [
      { "link": "", "name": "" },
      { "link": "", "name": "" },
      { "link": "", "name": "" }
    ],
    "answer": "give the plantUML code for this question. please give one line formatted",
    "answer_explanation": "",
    "interactive_steps": [
      { "step_number": 1, "description": "Step-by-Step Instruction or Hint" }
    ]
  }`;
