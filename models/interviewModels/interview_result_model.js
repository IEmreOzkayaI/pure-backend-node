import mongoose from "mongoose";
import {v4 as uuid} from "uuid";
export const INTERVIEW_RESULT_STATUS_ENUM = {
	INITIATED: {
		name: "INITIATED",
		detail: "INTERVIEW INITIATED",
		update_date: "05th Aug 2021",
	},
	REGISTERED: {
		name: "REGISTERED",
		detail: "Application Registered",
		update_date: "05th Aug 2021",
	},
	EXAMINING: {
		name: "EXAMINING",
		detail: "Application Examining",
		update_date: "05th Aug 2021",
	},
	CALL: {
		name: "CALL",
		detail: "Phone Call",
		update_date: "05th Aug 2021",
		communication_date: "05th Aug 2021",
	},
	MEET: {
		name: "MEET",
		detail: "Online Camera Meeting",
		update_date: "05th Aug 2021",
		communication_date: "05th Aug 2021",
	},
	REJECTED: {
		name: "REJECTED",
		detail: "Rejected",
		update_date: "05th Aug 2021",
	},
	ACCEPTED: {
		name: "ACCEPTED",
		detail: "Offer Send",
		update_date: "05th Aug 2021",
	},
};

const interview_result_schema = new mongoose.Schema({
	_id: {
		type: String,
		default: function genUUID() {
			return uuid();
		},
	},
	interview_id: {
		type: mongoose.Schema.Types.UUID,
		ref: "Interview",
	},

	user_id: {
		type: mongoose.Schema.Types.UUID,
		ref: "User",
	},

	interview_score: {
		type: Number,
		required: true,
		default: 0,
	},

	try_count: {
		type: Number,
		required: true,
		default: 0,
	},

	tab_leave_amount: {
		type: String,
		required: true,
		default: 0,
	},

	search_usage_amount: {
		type: String,
		required: true,
		default: 0,
	},

	time_spent: {
		type: Number,
		required: true,
		default: 0,
	},
	privacy_policy: {
		type: Boolean,
		required: true,
		default: true,
	},
	terms_of_use: {
		type: Boolean,
		required: true,
		default: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},

	updated_at: {
		type: Date,
		default: Date.now,
	},

	status: {
		type: Object,
		required: true,
		default: INTERVIEW_RESULT_STATUS_ENUM.INITIATED,
	},
});

export default mongoose.model("Interview_Result", interview_result_schema);
