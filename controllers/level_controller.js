import LevelModel from "../models/level_model.js";
import chalk from "chalk";
import getTimestamp from "../utils/time_stamp.js";

// @desc    Get all levels
// @route   GET /api/level/get_all
// @access  Private
const get_all = async (_req, _res) => {
    try {
        const levels = await LevelModel.find({});
        return _res.json(levels);
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level Couldn't Get -- Service : Level Get All`));
        return _res.status(500).json({message: 'Server Error'});


    }
};

// @desc    Add new level
// @route   POST /api/level/add
// @access  Private
const add = async (_req, _res) => {
    try {
        const { name, description } = _req.body;

        // Check if a level with the same name already exists
        const existingLevel = await LevelModel.findOne({ name });
        if (existingLevel) {
            return _res.status(400).json({ message: 'A level with this name already exists' });
        }

        const newLevel = new LevelModel({
            name,
            description
        });

        const addedLevel = await newLevel.save();
        return _res.status(201).json(addedLevel);
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level Couldn't Add -- Service : Level Add`) + error);
        return _res.status(500).json({message: 'Server Error'});
    }
};

// @desc    Get level by level id
// @route   GET /api/level/get/:level_id
// @access  Private
const get_by_level_id = async (_req, _res) => {
    try {
        const level = await LevelModel.findById(_req.params.level_id);
        if (level) {
            return _res.json(level);
        } else {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level Couldn't Get -- Service : Level Get By Level Id`));
            return _res.status(404).json({message: 'Level not found'});
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level Couldn't Get -- Service : Level Get By Level Id`)  + error);
        return _res.status(500).json({message: 'Server Error'});
    }
};

// @desc    Update level by level id
// @route   PUT /api/level/update/:level_id
// @access  Private
const update = async (_req, _res) => {
    try {
        const level = await LevelModel.findById(_req.params.level_id);

        if (level) {
            level.name = _req.body.name || level.name;
            level.description = _req.body.description || level.description;

            const updatedLevel = await level.save();
            return _res.json(updatedLevel);
        } else {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level Couldn't Update -- Service : Level Update`));
            return _res.status(404).json({message: 'Level not found'});
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level Couldn't Update -- Service : Level Update`) + error);
        return _res.status(500).json({message: 'Server Error'});
    }
};

// @desc    Delete level by level id
// @route   DELETE /api/level/delete/:level_id
// @access  Private
const delete_ = async (_req, _res) => {
    try {
        const level = await LevelModel.findById(_req.params.level_id);

        if (level) {
            await level.remove();
            return _res.json({message: 'Level removed'});
        } else {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level Couldn't Delete -- Service : Level Delete`));
            return _res.status(404).json({message: 'Level not found'});
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level Couldn't Delete -- Service : Level Delete`) + error);
        return _res.status(500).json({message: 'Server Error'});
    }
};

// @desc    Get level by question id
// @route   GET /api/level/get_by_question/:question_id
// @access  Private
const get_by_question_id = async (_req, _res) => {
    try {
        const questionId = _req.params.question_id;
        const level = await LevelModel.findOne({questionId: questionId});
        if (level) {
            return _res.json(level);
        } else {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level Couldn't Get -- Service : Level Get By Question Id`));
            return _res.status(404).json({message: 'Level not found for the given question id'});
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Level Couldn't Get -- Service : Level Get By Question Id`) + error);
        return _res.status(500).json({message: 'Server Error'});
    }
};

export default {
    get_all,
    add,
    get_by_level_id,
    update,
    delete_,
    get_by_question_id,
};