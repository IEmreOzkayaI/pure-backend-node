import asyncHandler from "express-async-handler";
import package_model from "../models/package_model.js";

// @desc    Get all packages
// @route   GET /api/package/get_all
// @access  Public
const get_all = asyncHandler(async (_req, _res) => {
	return _res.send("Get All");
});

// @desc    Add new package
// @route   POST /api/package/add
// @access  Private
const add = asyncHandler(async (_req, _res) => {
	return _res.send("Add");
});

// @desc    Get package by package id
// @route   GET /api/package/get/:package_id
// @access  Public
const get_by_package_id = asyncHandler(async (_req, _res) => {
	return _res.send("Get By Package Id");
});

// @desc    Update package by package id
// @route   PUT /api/package/update/:package_id
// @access  Private
const update = asyncHandler(async (_req, _res) => {
	return _res.send("Update");
});

// @desc    Delete package by package id
// @route   DELETE /api/package/delete/:package_id
// @access  Private
const delete_ = asyncHandler(async (_req, _res) => {
	return _res.send("Delete");
});

// @desc    Get package by user id
// @route   GET /api/package/get_by_user/:user_id
// @access  Private
const get_by_user_id = asyncHandler(async (_req, _res) => {
	return _res.send("Get By User Id");
});

export default {
	get_all,
	add,
	get_by_package_id,
	update,
	delete_,
	get_by_user_id,
};
