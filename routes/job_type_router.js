import express from "express";
import validate_access_token_handler from "../middlewares/validate_access_token_handler.js";
import job_type_controller from "../controllers/job_type_controller.js";
const job_type_router = express.Router();

job_type_router.use(validate_access_token_handler);

job_type_router.route("/add").post(job_type_controller.add);
job_type_router.route("/get_all").get(job_type_controller.get_all);
job_type_router.route("/get/:job_type_id").get(job_type_controller.get_by_job_type_id);
job_type_router.route("/update/:job_type_id").put(job_type_controller.update);
job_type_router.route("/delete/:job_type_id").delete(job_type_controller.delete_);

export default job_type_router;
