import mongoose from "mongoose";

const documentation_question_schema = new mongoose.Schema({
    topic: {
        type: String,
    },
    level_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Level",
    },
    jobType_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job_Type",
    },
    context: {
        type: String, // diagram type , sequence , use case , class , activity mı çözdürecek
    },
    content: {
        type: String, // documentation content
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    answer_explanation: {
        type: String,
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
    status: {
        type: String,
        required: true,
        default: "PENDING"
    },
});

export default mongoose.model("Documentation_Question", documentation_question_schema);