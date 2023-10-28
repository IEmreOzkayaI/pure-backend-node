import express from "express";
import validate_access_token_handler from "../middlewares/validate_access_token_handler.js";
import certificate_controller from "../controllers/certificate_controller.js";

const certificate_router = express.Router();

certificate_router.use(validate_access_token_handler)

certificate_router.route("/add").post(certificate_controller.add);
certificate_router.route("/get_all").get(certificate_controller.get_all);
certificate_router.route("/get/:certificate_id").get(certificate_controller.get_by_certificate_id);
certificate_router.route("/update/:certificate_id").put(certificate_controller.update);
certificate_router.route("/delete/:certificate_id").delete(certificate_controller.delete_);
certificate_router.route("/get_by_user/:user_id").get(certificate_controller.get_by_user_id);

export default certificate_router;