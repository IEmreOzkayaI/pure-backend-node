import mongoose from "mongoose";
import {v4 as uuid} from "uuid";

const challenge_schema = new mongoose.Schema({
    _id: {
        type: String, default: function genUUID() {
            return uuid()
        }
    },
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
        type: mongoose.Schema.Types.UUID,
        ref: "Diagram_Question",
    }, ],
    test_question_list: [{
        type: mongoose.Schema.Types.UUID,
        ref: "Test_Question",
    }, ],
    algorithm_question_list: [{
        type: mongoose.Schema.Types.UUID,
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