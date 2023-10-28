import mongoose from "mongoose";

const interview_result_schema = new mongoose.Schema({
    interview_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview"
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
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