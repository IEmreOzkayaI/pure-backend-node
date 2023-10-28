import mongoose from "mongoose";

const algorithm_question_result_schema = new mongoose.Schema({
    algorithmQuestion_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Algorithm_Question",
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    user_answer: {
        type: String,
        required: true,
    },
    is_correct: {
        type: Boolean,
        required: true,
    },
    try_count: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.model("Algorithm_Question_Result", algorithm_question_result_schema);