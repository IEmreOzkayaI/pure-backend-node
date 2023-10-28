import mongoose from "mongoose";

const challenge_result_schema = new mongoose.Schema({
	challenge_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Challenge",
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	challenge_score: {
		type: Number,
		required: true,
	},
	try_count: {
		type: Number,
		required: true,
	},
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},
	status: {type: String, required: true, default: "PENDING"},
});

export default mongoose.model("Challenge_Result", challenge_result_schema);
