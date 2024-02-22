import mongoose from "mongoose";
import {v4 as uuid} from "uuid";

const diagram_question_model = new mongoose.Schema({
    _id: {
        type: String, default: function genUUID() {
            return uuid()
        }
    },
    topic: { // diagram type , sequence , use case , class , activity ın mı dökümanını istiyecek
        type: String,
    },
    name: { // soru adı
        type: String,
        required: true,
    },
    level: {
        type: mongoose.Schema.Types.UUID,
        ref: "Level",
    },
    real_life_application: {
        type: String,
        required: true,
    },
    description: { // soru içeriği
        type: String,
        required: true,
    },
    additional_resources_about_topic: {
        type: Array,
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

export default mongoose.model("Diagram_Question", diagram_question_model);

// steps
// actors
// functions bunlarıda ayrı ayrı alabiliriz.