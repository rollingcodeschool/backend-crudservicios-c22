import { Router } from "express";
import { agregarAlCarrito } from "../controllers/carrito.controllers.js";
import { authenticate } from "../middlewares/authenticator.js";

const router = Router();

router.route('/').post(authenticate,agregarAlCarrito)

export default router