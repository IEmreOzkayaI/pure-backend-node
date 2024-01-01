import mongoose from "mongoose";
import {v4 as uuid} from "uuid";

const common_user_schema = new mongoose.Schema({
    _id: {
        type: String, default: function genUUID() {
            return uuid()
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    totp_secret_key: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Common_User", common_user_schema);
