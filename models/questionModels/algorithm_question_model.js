import mongoose from "mongoose";
import {v4 as uuid} from "uuid";

const algorithm_question_schema = new mongoose.Schema({
    _id: {
        type: String, default: function genUUID() {
            return uuid()
        }
    },
    name: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    level: {
        type: mongoose.Schema.Types.UUID,
        ref: "Level",
    },
    description: {
        scenario: {
            type: String,
            required: true,
        },
        question: {
            type: String,
            required: true,
        },
    },
    real_life_application: {
        type: String,
        required: true,
    },
    time_complexity_analysis: {
        best_case: {
            type: String,
            required: true,
        },
        worst_case: {
            type: String,
            required: true,
        },
        average_case: {
            type: String,
            required: true,
        },
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
        javascript: {
            type: String,
            required: true,
        },
        python: {
            type: String,
            required: true,
        },
        java: {
            type: String,
            required: true,
        },
        cSharp: {
            type: String,
            required: true,
        },
    },
    answer: {
        javascript: {
            type: String,
            required: true,
        },
        python: {
            type: String,
            required: true,
        },
        java: {
            type: String,
            required: true,
        },
        cSharp: {
            type: String,
            required: true,
        },
    },
    answer_explanation: {
        type: String,
        required: true,
    },
    test_cases: {
        type: Array,
        required: true,
    },
    additional_resources_about_algorithm_and_topic: {
        type: Array,
        required: true,
    },
    interactive_steps: {
        type: Array,
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