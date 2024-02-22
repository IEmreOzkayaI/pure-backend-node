import express from "express";
import validate_access_token_handler from "../middlewares/validate_access_token_handler.js";
import level_controller from "../controllers/level_controller.js";

const level_router = express.Router();

// level_router.use(validate_access_token_handler);

level_router.route("/add").post(level_controller.add);
level_router.route("/get_all").get(level_controller.get_all);
level_router.route("/get/:level_id").get(level_controller.get_by_level_id);
level_router.route("/update/:level_id").put(level_controller.update);
level_router.route("/delete/:level_id").delete(level_controller.delete_);
level_router.route("/get_by_question/:question_id").get(level_controller.get_by_question_id);

export default level_router;
