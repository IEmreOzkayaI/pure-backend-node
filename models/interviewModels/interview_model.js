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
    questions:{
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
    },
    company_list: [{
        type: mongoose.Schema.Types.UUID,
        ref: "Company_User",
    }, ],
    interview_time: {
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
    start_date: {
        type: String,
        required: true
    },
    end_date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "PENDING"
    },
});

export default mongoose.model("Interview", interview_schema);