import express from "express";
import refresh_token_controller from "../controllers/refresh_token_controller.js";
const token_router = express.Router();

token_router.route("/token").get(refresh_token_controller.refresh_token);


export default token_router;

