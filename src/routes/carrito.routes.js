import { Router } from "express";
import { agregarAlCarrito, obtenerCarrito } from "../controllers/carrito.controllers.js";
import { authenticate } from "../middlewares/authenticator.js";

const router = Router();

router.route('/').post(authenticate,agregarAlCarrito).get(authenticate,obtenerCarrito)

export default router