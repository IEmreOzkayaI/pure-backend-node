import mongoose from "mongoose";

const challenge_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    certificate: {
        type: String,
        required: true
    },
    diagram_question_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diagram_Question",
    }, ],
    test_question_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test_Question",
    }, ],
    documentation_question_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Documentation_Question",
    }, ],
    algorithm_question_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Algorithm_Question",
    }, ],
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

export default mongoose.model("Challenge", challenge_schema);