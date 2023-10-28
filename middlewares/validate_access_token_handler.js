import jwt from "jsonwebtoken";
import chalk from "chalk";
import getTimestamp from "../utils/time_stamp.js";
import dotenv from "dotenv";
dotenv.config()

const validate_access_token = async (_req, _res, next) => {
	try {
		let authHeader = _req.headers.Authorization || _req.headers.authorization;

		// Check if the 'Authorization' header is missing or doesn't start with 'Bearer'
		if (!authHeader || !authHeader.startsWith("Bearer")) {
			console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : Not authorized, no token -- Service : validate_access_token`));
			return _res.status(401).json({message: "Not authorized, no token"});
		}

		// Extract the token from the header
		const token = authHeader.split(" ")[1];
		// Verify the token
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
			if (err) {
				console.error(chalk.bold(`${getTimestamp()} Status Code : 403 -- Error : Not authorized, no valid token -- Service : validate_access_token`));
				return _res.status(403).json({message: "Not authorized, no valid token"});
			}

			// If the token is valid, set the user in the request and proceed to the next middleware
			_req.user = {_id: decoded._id, role: decoded.role};
			next();
		});
	} catch (error) {
		console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Validate Token Error -- Service : validate_access_token`));
		return _res.status(400).json({message: "Validate Token Error "});
	}
};

export default validate_access_token;

/** asynchandler kullanırsam kodu yazarken try içindeymiş gibi yazarım ve error oluşursa catche gibi davranarak hatayı kendisi döner */
/** daha sonrasında throw new error yapısı ise benim dönülen hatayı özelleştirmemi sağlar , default hatadan ziyade benimkini kullanır */
/** error handler dosyası sayesimde oluşturduğum yapıyla birlikte benim belirlediğim statu koduna göre anlamlı bir json objesi şeklinde geriye döner. Eğer error handler kullanmazsam karmaşık bir html hatası döner. */
