import asyncHandler from "express-async-handler";
import certificate_model from "../models/certificate_model.js";

// @desc    Get all certificates
// @route   GET /api/certificate/get_all
// @access  Private
const get_all = asyncHandler(async (_req, _res) => {
    return _res.send("Get All");
});

// @desc    Add new certificate
// @route   POST /api/certificate/add
// @access  Private
const add = asyncHandler(async (_req, _res) => {
    return _res.send("Add");
});

// @desc    Get certificate by certificate id
// @route   GET /api/certificate/get/:certificate_id
// @access  Private
const get_by_certificate_id = asyncHandler(async (_req, _res) => {
    return _res.send("Get By Certificate Id");
});

// @desc    Update certificate by certificate id
// @route   PUT /api/certificate/update/:certificate_id
// @access  Private
const update = asyncHandler(async (_req, _res) => {
    return _res.send("Update");
});

// @desc    Delete certificate by certificate id
// @route   DELETE /api/certificate/delete/:certificate_id
// @access  Private
const delete_ = asyncHandler(async (_req, _res) => {
    return _res.send("Delete");
});

// @desc    Get certificate by user id
// @route   GET /api/certificate/get_by_user/:user_id
// @access  Private
const get_by_user_id = asyncHandler(async (_req, _res) => {
    return _res.send("Get By User Id");
});

export default {
    get_all,
    add,
    get_by_certificate_id,
    update,
    delete_,
    get_by_user_id,
};
