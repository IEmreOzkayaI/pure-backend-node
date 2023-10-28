import mongoose from "mongoose";

const level_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    test_question_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test_Question"
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

export default mongoose.model("Level", level_schema);