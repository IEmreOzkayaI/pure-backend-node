import mongoose from "mongoose";
import {v4 as uuid} from "uuid";

const documentation_question_schema = new mongoose.Schema({
    _id: {
        type: String, default: function genUUID() {
            return uuid()
        }
    },
    topic: {
        type: String,
    },
    level_id: {
        type: mongoose.Schema.Types.UUID,
        ref: "Level",
    },
    context: {
        type: String, // diagram type , sequence , use case , class , activity ın mı dökümanını istiyecek
    },
    content: {
        type: String, // diagram image
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

export default mongoose.model("Diagram_Question", documentation_question_schema);