import mongoose from "mongoose";
import {v4 as uuid} from "uuid";

const individual_user_schema = new mongoose.Schema({
	_id: { type: String, default: function genUUID() {
			return uuid()
		}},
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
		default: "regular", // free, premium , interview
	},
	cover_letter: {
	  type: String,
		required: false,
	},
	notification_list: [
		{
			type: mongoose.Schema.Types.UUID,
			ref: "Notification",
			default: [],
		},
	],
	challenge_list: [
		{
			type: mongoose.Schema.Types.UUID,
			ref: "Challenge",
			default: [],
		},
	],
	certificate_list: [
		{
			type: mongoose.Schema.Types.UUID,
			ref: "Certificate",
			default: [],
		},
	],
	entered_interview_list: [
		// only registered user can see this
		{
			type: mongoose.Schema.Types.UUID,
			ref: "Interview",
			default: [],
		},
	],
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
