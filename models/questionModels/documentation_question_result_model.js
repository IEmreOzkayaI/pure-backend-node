import mongoose from "mongoose";
import {v4 as uuid} from "uuid";

const documentation_question_result_schema = new mongoose.Schema({
    _id: {
        type: String, default: function genUUID() {
            return uuid()
        }
    },
    testQuestion_id: {
        type: mongoose.Schema.Types.UUID,
        ref: "Documentation_Question",
    },
    user_id: {
        type: mongoose.Schema.Types.UUID,
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

export default mongoose.model("Documentation_Question_Result", documentation_question_result_schema);