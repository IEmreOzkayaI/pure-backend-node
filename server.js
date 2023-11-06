import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
/** Router */
import user_router from "./routes/user_router.js";
import question_router from "./routes/question_router.js";
import challenge_router from "./routes/challenge_router.js";
import interview_router from "./routes/interview_router.js";
import certificate_router from "./routes/certificate_router.js";
import job_type_router from "./routes/job_type_router.js";
import level_router from "./routes/level_router.js";
import notification_router from "./routes/notification_router.js";
import package_router from "./routes/package_router.js";
import technology_router from "./routes/technology_router.js";
import token_router from "./routes/token_router.js";
import credentials from "./middlewares/credentials.js";
import cors_options from "./config/cors_options.js";
import {connectDb} from "./config/db_connection.js";
import dotenv from "dotenv";
/** DB Connection */
connectDb()

const app = express();
dotenv.config();

/** Request Handler Middlewares */
app.use(credentials);
app.use(cors(cors_options));
app.use(express.urlencoded({extended: false}));
app.use(express.text({ type: "text/plain" }));
app.use(express.json());
app.use(cookieParser());
app.disable("x-powered-by");

app.get("/api/user/forgot-password", (_req, _res) => {
	_res.render("forgot-password");
})

/** Router Connection */
app.use("/api/user", user_router);
app.use("/api/refresh", token_router);
app.use("/api/question", question_router);
app.use("/api/challenge", challenge_router);
app.use("/api/interview", interview_router);
app.use("/api/certificate", certificate_router);
app.use("/api/jobType", job_type_router);
app.use("/api/level", level_router);
app.use("/api/notification", notification_router);
app.use("/api/package", package_router);
app.use("/api/technology", technology_router);

app.use("*", (_req, _res) => {
	_res.status(404).json({error: "Page not found mu cookie 🤕?"});
});

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
