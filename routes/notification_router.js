import express from "express";
import validate_access_token_handler from "../middlewares/validate_access_token_handler.js";
import notification_controller from "../controllers/notification_controller.js";

const notification_router = express.Router();

notification_router.use(validate_access_token_handler);

notification_router.route("/send").post(notification_controller.send);
notification_router.route("/get_all").get(notification_controller.get_all);
notification_router.route("/get/:notification_id").get(notification_controller.get_by_notification_id);
notification_router.route("/update/:notification_id").put(notification_controller.update);
notification_router.route("/delete/:notification_id").delete(notification_controller.delete_);
notification_router.route("/get_by_user/:user_id").get(notification_controller.get_by_user_id);

export default notification_router;
