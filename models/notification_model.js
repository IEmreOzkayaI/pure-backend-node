import mongoose from "mongoose";
import {v4 as uuid} from "uuid";

const notification_schema = new mongoose.Schema({
    _id: {
        type: String, default: function genUUID() {
            return uuid()
        }
    },
    user_id: {
        type: mongoose.Schema.Types.UUID,
        ref: "User"
    },
    notification_type: {
        type: String,
        required: true
    },
    notification_text: {
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

export default mongoose.model("Notification", notification_schema);