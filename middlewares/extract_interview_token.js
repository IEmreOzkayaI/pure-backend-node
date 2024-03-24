import jwt from "jsonwebtoken";
import chalk from "chalk";
import getTimestamp from "../utils/time_stamp.js";
import dotenv from "dotenv";

dotenv.config();

const extract_interview_token = async (_req, _res, _next) => {
	console.log(_req.params.interview_signature);
	const token = atob(_req.params.interview_signature);
	console.log(token);
	if (!token) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : Unauthorized -- Service : Extract Interview Token`));
		return _res.status(401).json({message: "No Valid Token"});
	}
	try {
    console.log(_req.body.register_type);
		if ((_req.body.register_type === "Interview")) { // for interview registration
			jwt.verify(token, process.env.INTERVIEW_SIGN_SECRET, (err, decoded) => {
				if (err) {
					console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : Unauthorized -- Service : Extract Interview Token`));
					return _res.status(401).json({message: "Unauthorized when register signature verify"});
				}
				_req.interview_signature_info = {interview_id: decoded.interview_id, user_id: decoded.user_id};
				console.log(chalk.bold(`${getTimestamp()} Status Code : 200 -- Message : Token Extracted -- Service : Extract Interview Token`));
				_next();
			});
		} else {
			jwt.verify(token, process.env.INTERVIEW_PLAYGROUND_SIGN_SECRET, (err, decoded) => {
				if (err) {
					console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : Unauthorized -- Service : Extract Interview Token`));
					return _res.status(401).json({message: "Unauthorized when signature verify"});
				}
				_req.interview_signature_info = {interview_id: decoded.interview_id, user_id: decoded.user_id};
				console.log(chalk.bold(`${getTimestamp()} Status Code : 200 -- Message : Token Extracted -- Service : Extract Interview Token`));
				_next();
			});
		}
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : Unauthorized -- Service : Extract Interview Token`));
		return _res.status(503).json({message: "Unauthorized"});
	}
};

export default extract_interview_token;
