import mongoose from "mongoose";
import {v4 as uuid} from "uuid";
const level_schema = new mongoose.Schema({
    _id: { type: String, default: function genUUID() {
            return uuid()
        }},
    name: {
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
    status: {
        type: String,
        required: true,
        default: "PENDING"
    },
});

export default mongoose.model("Level", level_schema , "levels");