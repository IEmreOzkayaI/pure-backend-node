import mongoose from "mongoose";
import {v4 as uuid} from "uuid";

const test_question_schema = new mongoose.Schema({
    _id: {
        type: String, default: function genUUID() {
            return uuid()
        }
    },
    name: {
        type: String,
        required: true
    },
    topic: {
        type: String
    },
    level: {
        type: mongoose.Schema.Types.UUID,
        ref: "Level"
    },
    // question
    question: {
        type: String,
        required: true
    },
    choices: [{
        type: String,
        required: true
    }],
    answer: {
        type: String,
        required: true
    },
    answer_explanation: {
        type: String,
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

export default mongoose.model("Test_Question", test_question_schema);