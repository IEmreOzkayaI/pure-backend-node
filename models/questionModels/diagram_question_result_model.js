import mongoose from "mongoose";
import {v4 as uuid} from "uuid";

const diagram_question_result_schema = new mongoose.Schema({
    _id: {
        type: String, default: function genUUID() {
            return uuid()
        }
    },
    diagramQuestion_id: {
        type: mongoose.Schema.Types.UUID,
        ref: "Diagram_Question",
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

export default mongoose.model("Diagram_Question_Result", diagram_question_result_schema);