import express from "express";
import validate_access_token_handler from "../middlewares/validate_access_token_handler.js";
import package_controller from "../controllers/package_controller.js";

const package_router = express.Router();

package_router.route("/add").post(validate_access_token_handler, package_controller.add);
package_router.route("/get_all").get(package_controller.get_all);
package_router.route("/get/:package_id").get(package_controller.get_by_package_id);
package_router.route("/update/:package_id").put(validate_access_token_handler, package_controller.update);
package_router.route("/delete/:package_id").delete(validate_access_token_handler, package_controller.delete_);
package_router.route("/get_by_user/:user_id").get(validate_access_token_handler, package_controller.get_by_user_id);

export default package_router;
