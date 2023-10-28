import mongoose from "mongoose";

const test_question_schema = new mongoose.Schema({
    topic: {
        type: String
    },
    level_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Level"
    },
    job_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job_Type"
    },
    // algorithm , description . text , real life scenario
    context: {
        type: String
    },
    // question
    content: {
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