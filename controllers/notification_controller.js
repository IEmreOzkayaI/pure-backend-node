import asyncHandler from "express-async-handler";
import notification_model from "../models/notification_model.js";

// @desc    Send notification
// @route   POST /api/notification/send
// @access  Private
const send = asyncHandler(async (_req, _res) => {
    return _res.send("Send");
});

// @desc    Get all notifications
// @route   GET /api/notification/get_all
// @access  Private
const get_all = asyncHandler(async (_req, _res) => {
    return _res.send("Get All");
});

// @desc    Get notification by notification id
// @route   GET /api/notification/get/:notification_id
// @access  Private
const get_by_notification_id = asyncHandler(async (_req, _res) => {
    return _res.send("Get By Notification Id");
});

// @desc    Update notification by notification id
// @route   PUT /api/notification/update/:notification_id
// @access  Private
const update = asyncHandler(async (_req, _res) => {
    return _res.send("Update");
});

// @desc    Delete notification by notification id
// @route   DELETE /api/notification/delete/:notification_id
// @access  Private
const delete_ = asyncHandler(async (_req, _res) => {
    return _res.send("Delete");
});

// @desc    Get notification by user id
// @route   GET /api/notification/get_by_user/:user_id
// @access  Private
const get_by_user_id = asyncHandler(async (_req, _res) => {
    return _res.send("Get By User Id");
});

export default {
    send,
    get_all,
    get_by_notification_id,
    update,
    delete_,
    get_by_user_id,
};

