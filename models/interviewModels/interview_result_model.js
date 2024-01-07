import mongoose from "mongoose";
import {v4 as uuid} from "uuid";

const interview_result_schema = new mongoose.Schema({
    _id: {
        type: String, default: function genUUID() {
            return uuid()
        }
    },
    interview_id: {
        type: mongoose.Schema.Types.UUID,
        ref: "Interview"
    },

    user_id: {
        type: mongoose.Schema.Types.UUID,
        ref: "User"
    },

    interview_score: {
        type: Number,
        required: true
    },

    try_count: {
        type: Number,
        required: true
    },

    tab_leave_amount: {
        type: String,
        required: true
    },

    search_usage_amount: {
        type: String,
        required: true
    },

    time_spent: {
        type: Number,
        required: true
    },
    privacy_policy: {
        type: Boolean,
        required: true,
        default: false
    },
    terms_of_use: {
        type: Boolean,
        required: true,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        required: true,
        default: "PENDING"
    },
});

export default mongoose.model("Interview_Result", interview_result_schema);