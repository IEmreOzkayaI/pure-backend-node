import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const auth_schema = new mongoose.Schema({
    _id: {
        type: String,
        default: function genUUID() {
            return uuid()
        }
    },
    individual_user_id: {
        type: mongoose.Schema.Types.UUID,
        ref: "Individual_User",
    },
    company_user_id: {
        type: mongoose.Schema.Types.UUID,
        ref: "Company_User",
    },
    admin_user_id: {
        type: mongoose.Schema.Types.UUID,
        ref: "Admin_User",
    },
    refresh_token: {
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
    expire_at: {
        type: Date,
        default: function() {
            const TTL_SECONDS = 60 * 60 * 24; // 24 hour
            return new Date(Date.now() + TTL_SECONDS * 1000);
        }
    }

});

// TTL index oluşturma
auth_schema.index({ expire_at: 1 }, { expireAfterSeconds: 0 }); // 'expireAfterSeconds' 0 olmalıdır

export default mongoose.model("Auth", auth_schema);
