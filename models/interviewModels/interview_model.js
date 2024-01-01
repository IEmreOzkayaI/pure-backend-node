import mongoose from 'mongoose';
import {v4 as uuid} from "uuid";

const interview_schema = new mongoose.Schema({
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
    diagram_question_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diagram_Question",
    }, ],
    test_question_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test_Question",
    }, ],
    algorithm_question_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Algorithm_Question",
    }, ],
    company_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company_User",
    }, ],
    interview_time: {
        type: Number,
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
    closed_at: {
        type: Date,
        default: Date.now
    },
    privacy_policy: {
        type: Boolean,
        required: true,
        default: false
    },
    terms_of_use: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: String,
        required: true,
        default: "PENDING"
    },
});

export default mongoose.model("Interview", interview_schema);