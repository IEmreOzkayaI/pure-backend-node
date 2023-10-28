import express from "express";
import validate_access_token_handler from "../middlewares/validate_access_token_handler.js";
import technology_controller from "../controllers/technology_controller.js";
const technology_router = express.Router();

technology_router.use(validate_access_token_handler);

technology_router.route("/get_all").get(technology_controller.get_all);
technology_router.route("/add").post(technology_controller.add);
technology_router.route("/update").put(technology_controller.update);
technology_router.route("/delete").delete(technology_controller.delete_);

export default technology_router;