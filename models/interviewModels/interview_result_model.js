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
        required: true,
        default: 0
    },

    try_count: {
        type: Number,
        required: true,
        default: 0
    },

    tab_leave_amount: {
        type: String,
        required: true,
        default: 0
    },

    search_usage_amount: {
        type: String,
        required: true,
        default: 0
    },

    time_spent: {
        type: Number,
        required: true,
        default: 0

    },
    privacy_policy: {
        type: Boolean,
        required: true,
        default: true
    },
    terms_of_use: {
        type: Boolean,
        required: true,
        default: true
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
        default: "INITIATED" // PENDING, INITIATED, COMPLETED
    },
});

export default mongoose.model("Interview_Result", interview_result_schema);
