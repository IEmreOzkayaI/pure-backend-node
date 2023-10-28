import mongoose from "mongoose";

const algorithm_question_schema = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
    },
    level_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Level",
    },
    jobType_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job_Type",
    },
    technology_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Technology",
    },
    description: {
        type: String,
        required: true,
    },
    whole_code: {
        // all of the code without answer included
        type: String,
        required: true,
    },
    example_input: {
        type: String,
        required: true,
    },
    example_output: {
        type: String,
        required: true,
    },
    missing_part: {
        // the part that is missing from the code
        type: String,
        required: true,
    },
    imported_libraries: [{
        // the libraries that are imported
        type: String,
        required: true,
    }, ],
    answer: {
        // the answer code
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

export default mongoose.model("Algorithm_Question", algorithm_question_schema);