import { Router } from "express";
import { crearPreferenciaPago, recibirWebhook } from "../controllers/pago.controllers.js";
import { authenticate } from "../middlewares/authenticator.js";

const router = Router();

router.route("/crear-preferencia").post(authenticate, crearPreferenciaPago);

// Endpoint público para Mercado Pago (Webhook)
router.route("/webhook").post(recibirWebhook);

export default router;
