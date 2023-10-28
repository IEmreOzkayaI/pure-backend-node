import mongoose from "mongoose";

const job_type_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    test_question_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test_Question"
    }],
    algorithm_question_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Algorithm_Question"
    }],
    documentation_question_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Documentation_Question"
    }],
    diagram_question_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diagram_Question"
    }],
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

export default mongoose.model("Job_Type", job_type_schema);