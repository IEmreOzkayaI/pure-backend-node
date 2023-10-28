import mongoose from "mongoose";

const package_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    futures: {
        type: [String],
        required: true
    },
    // company_user_list: [{
    //     user: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Company_User",
    //     },
    //     package_start_date: Date,
    //     package_end_date: Date,
    // }, ],
    // regular_user_list: [{
    //     user: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Individual_User",
    //     },
    //     package_start_date: Date,
    //     package_end_date: Date,
    // }, ],
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

export default mongoose.model("Package", package_schema);