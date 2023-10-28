import mongoose from "mongoose";

const certificate_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    challenge_id_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge"
    }],
    user_id_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
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

export default mongoose.model("Certificate", certificate_schema);