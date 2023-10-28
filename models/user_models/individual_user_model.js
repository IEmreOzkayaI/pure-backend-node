import mongoose from "mongoose";

const individual_user_schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	surname: {
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
		default: false,
	},
	terms_of_use: {
		type: Boolean,
		required: true,
		default: false,
	},
	register_method: {
		type: String,
		required: true,
		default: "onSite", // onSite, linkedin, github, google
	},
	register_type: {
		type: String,
		required: true,
		default: "regular", // regular, premium
	},
	notification_list: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Notification",
			default: [],
		},
	],
	challenge_list: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Challenge",
			default: [],
		},
	],
	technology_list: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Technology",
			default: [],
		},
	],
	certificate_list: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Certificate",
			default: [],
		},
	],
	entered_interview_list: [
		// only registered user can see this
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Interview",
			default: [],
		},
	],
	package: {
		package: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Package",
		},
		package_start_date: Date,
		package_end_date: Date,
	},
	github_account: {
		type: String,
		required: false,
	},
	linkedin_account: {
		type: String,
		required: false,
	},
	about: {
		type: String,
		required: false,
	},
	education: {
		type: String,
		required: false,
	},
	experience: {
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

export default mongoose.model("Individual_User", individual_user_schema);
