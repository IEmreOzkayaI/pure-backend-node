import express from "express";
import validate_access_token_handler from "../middlewares/validate_access_token_handler.js";
import algorithm_question_controller from "../controllers/question_controllers/algorithm_question_controller.js";
import diagram_question_controller from "../controllers/question_controllers/diagram_question_controller.js";
import test_question_controller from "../controllers/question_controllers/test_question_controller.js";
import question_controller from "../controllers/question_controllers/question_controller.js";

const question_router = express.Router();

// question_router.use(validate_access_token_handler);

question_router.route("/add").post(question_controller.add);
question_router.route("/update").put(question_controller.update);
question_router.route("/get_all").get(question_controller.get_all);
question_router.route("/delete/:question_id").delete(question_controller.delete_);
question_router.route("/get/:question_id").get(question_controller.get_by_question_id);

/** Algorithm Questions */
question_router.route("/add_algorithm").post(algorithm_question_controller.add_algorithm);
question_router.route("/get_all_algorithm").get(algorithm_question_controller.get_all_algorithm);
question_router.route("/get_algorithm/:algorithm_id").get(algorithm_question_controller.get_algorithm_by_id);
question_router.route("/update_algorithm/:algorithm_id").put(algorithm_question_controller.update_algorithm);
question_router.route("/delete_algorithm/:algorithm_id").delete(algorithm_question_controller.delete_algorithm);
question_router.route("/get_algorithm/:level_id").get(algorithm_question_controller.get_algorithm_by_level);
question_router.route("/run_algorithm").post(algorithm_question_controller.run_algorithm);

/** Diagram Questions */
question_router.route("/add_diagram").post(diagram_question_controller.add_diagram);
question_router.route("/get_all_diagram").get(diagram_question_controller.get_all_diagram);
question_router.route("/get_diagram/:diagram_id").get(diagram_question_controller.get_diagram_by_id);
question_router.route("/update_diagram/:diagram_id").put(diagram_question_controller.update_diagram);
question_router.route("/delete_diagram/:diagram_id").delete(diagram_question_controller.delete_diagram);
question_router.route("/get_diagram/:level_id").get(diagram_question_controller.get_diagram_by_level);

/** Test Questions */
question_router.route("/add_test").post(test_question_controller.add_test);
question_router.route("/get_all_test").get(test_question_controller.get_all_test);
question_router.route("/get_test/:test_id").get(test_question_controller.get_test_by_id);
question_router.route("/update_test/:test_id").put(test_question_controller.update_test);
question_router.route("/delete_test/:test_id").delete(test_question_controller.delete_test);
question_router.route("/get_test/:level_id").get(test_question_controller.get_test_by_level);

export default question_router;
