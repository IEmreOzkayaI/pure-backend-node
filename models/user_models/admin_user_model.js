import mongoose from "mongoose";
import {v4 as uuid} from "uuid";

const admin_user_schema = new mongoose.Schema({
    _id: {
        type: String, default: function genUUID() {
            return uuid()
        }
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    register_method: {
        type: String,
        required: true,
        default: "onSite"
    },
    register_type: {
        type: String,
        required: true,
        default: "regular"
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
    notification_list: [{
        type: mongoose.Schema.Types.UUID,
        ref: "Notification",
    }, ],
});

export default mongoose.model("Admin_User", admin_user_schema);