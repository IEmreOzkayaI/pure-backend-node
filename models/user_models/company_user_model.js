import mongoose from "mongoose";

const company_user_schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phone_number: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	privacy_policy: {
		type: Boolean,
		required: true,
	},
	terms_of_use: {
		type: Boolean,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	industry: {
		type: String,
		required: true,
	},
	employee_count: {
		type: String,
		required: true,
	},
	web_site: {
		type: String,
		required: true,
	},
	package: {
		package: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Package",
		},
		package_start_date: Date,
		package_end_date: Date,
	},
	company_user_list: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Individual_User",
            default: [],
		},
	],
	interview_list: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Interview",
            default: [],
		},
	],
    notification_list: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Notification",
            default: [],
		},
	],
	linkedin_account: {
		type: String,
		required: false,
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
		type: String,
		required: true,
		default: "PASSIVE",
	},
});

export default mongoose.model("Company_User", company_user_schema);
