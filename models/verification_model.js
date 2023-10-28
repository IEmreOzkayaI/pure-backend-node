import mongoose from "mongoose";

const verification_schema = new mongoose.Schema({
	
	individual_user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Individual_User",
	},
	company_user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Company_User",
	},
	admin_user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Admin_User",
	},
    verification_code: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

verification_schema.index({ created_at: 1 }, { expireAfterSeconds: 60 * 5 });

export default mongoose.model("Verification", verification_schema);
