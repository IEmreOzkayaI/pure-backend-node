import express from "express";
import validate_access_token_handler from "../middlewares/validate_access_token_handler.js";
import user_controller from "../controllers/user_controller.js";
import rateLimit from "express-rate-limit";

const user_router = express.Router();

/** Rate Limiter */
const login_account_limiter = rateLimit({
	windowMs: 3 * 60 * 1000, // 3 minutes
	max: 50, // limit each IP to 100 requests per windowMs
    message: "Too many accounts created from this IP, please try again after three minutes"
});

user_router.route("/register").post(user_controller.register);
user_router.route("/login").post(user_controller.login);
// user_router.route("/login").post(login_account_limiter,user_controller.login);
user_router.route("/logout").get(validate_access_token_handler, user_controller.logout);
user_router.route("/forgot-password").post(user_controller.forgot_password);
user_router.route("/reset-password/:reset_token/:email").post(user_controller.reset_password);
user_router.route("/current").get(validate_access_token_handler, user_controller.current);
user_router.route("/confirm").post(user_controller.confirm);
user_router.route("/re-confirm").get(user_controller.re_validate);


export default user_router;
