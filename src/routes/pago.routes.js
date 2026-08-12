import { Router } from "express";
import { crearPreferenciaPago } from "../controllers/pago.controllers.js";
import { authenticate } from "../middlewares/authenticator.js";

const router = Router();

router
  .route("/crear-preferencia").post(authenticate,crearPreferenciaPago)

  export default router;
