import constants from "./constants.js";

const error_handler = (err, _req, _res, next) => {
	const statusCode = _res.statusCode ? _res.statusCode : 500;
	console.log("Error handler : ", err);
	console.log("Error handler : ", statusCode);
	switch (statusCode) {
		case constants.FORBIDDEN:
			console.log(`Status Code : ${statusCode} Error : ${err.message}`);
			_res.json({
				title: "Forbidden",
				message: err.message,
				// stackTrace: err.stack,
			});
			break;
		case constants.NOT_FOUND:
			console.log(`Status Code : ${statusCode} Error : ${err.message}`);
			_res.json({
				title: "Not found",
				message: err.message,
				// stackTrace: err.stack,
			});
			break;
		case constants.UNAUTHORIZED:
			console.log(`Status Code : ${statusCode} Error : ${err.message}`);
			_res.json({
				title: "Unauthorized",
				message: err.message,
				// stackTrace: err.stack,
			});
			break;
		case constants.VALIDATION_ERROR:
			console.log(`Status Code : ${statusCode} Error : ${err.message}`);
			_res.json({
				title: "Validation Error",
				message: err.message,
				// stackTrace: err.stack,
			});
			break;
		case constants.SERVER_ERROR:
			console.log(`Status Code : ${statusCode} Error : ${err.message}`);
			_res.json({
				title: "Server Error",
				message: err.message,
				// stackTrace: err.stack,
			});
			break;
		default:
			console.log("No error all good");
			break;
	}
};
export default error_handler;
