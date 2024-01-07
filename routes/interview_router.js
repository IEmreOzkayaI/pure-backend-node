import express from "express";
import validate_access_token_handler from "../middlewares/validate_access_token_handler.js";
import interview_controller from "../controllers/interview_controller.js";
const interview_router = express.Router();

// interview_router.use(validate_access_token_handler);

/** Interview Model routes */
interview_router.route("/add_interview").post(interview_controller.add_interview);
interview_router.route("/get_all_interview").get(interview_controller.get_all_interview);
interview_router.route("/get_by_interview_id/:interview_id").get(interview_controller.get_by_interview_id);
interview_router.route("/update_interview/:interview_id").put(interview_controller.update_interview);
interview_router.route("/delete_interview/:interview_id").delete(interview_controller.delete_interview);

/** Interview Result Model routes */
interview_router.route("/add_result").post(interview_controller.add_result);
interview_router.route("/get_all_result").get(interview_controller.get_all_result);
interview_router.route("/get_result/:interview_result_id").get(interview_controller.get_by_interview_result_id);
interview_router.route("/update_result/:interview_result_id").put(interview_controller.update_result);
interview_router.route("/delete_result/:interview_result_id").delete(interview_controller.delete_result);
interview_router.route("/get_result/:user_id").get(interview_controller.get_result_by_user_id);

export default interview_router;
