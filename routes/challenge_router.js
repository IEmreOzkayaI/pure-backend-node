import express from "express";
import validate_access_token_handler from "../middlewares/validate_access_token_handler.js";
import challenge_controller from "../controllers/challenge_controller.js";

const challenge_router = express.Router();

challenge_router.use(validate_access_token_handler);

/** Challenge Model routes */
challenge_router.route("/add").post(challenge_controller.add);
challenge_router.route("/get_all").get(challenge_controller.get_all);
challenge_router.route("/get/:challenge_id").get(challenge_controller.get_by_challenge_id);
challenge_router.route("/update/:challenge_id").put(challenge_controller.update);
challenge_router.route("/delete/:challenge_id").delete(challenge_controller.delete_);

/** Challenge Result Model routes */

challenge_router.route("/add_result").post(challenge_controller.add_result);
challenge_router.route("/get_all_result").get(challenge_controller.get_all_result);
challenge_router.route("/get_result/:challenge_result_id").get(challenge_controller.get_by_challenge_result_id);
challenge_router.route("/update_result/:challenge_result_id").put(challenge_controller.update_result);
challenge_router.route("/delete_result/:challenge_result_id").delete(challenge_controller.delete_result);
challenge_router.route("/get_result/:user_id").get(challenge_controller.get_by_user_id);

export default challenge_router;
