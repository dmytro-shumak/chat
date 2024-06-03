import express from "express";
import { authController } from "../controllers/authController";
import { checkTokenController } from "../controllers/checkTokenController";

const router = express.Router();

router.post("/login", authController);
router.post("/check-token", checkTokenController);

export default router;
