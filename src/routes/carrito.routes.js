import { Router } from "express";
import {
  agregarAlCarrito,
  eliminarServicio,
  obtenerCarrito,
  restarCantidadServicio,
  vaciarCarrito,
} from "../controllers/carrito.controllers.js";
import { authenticate } from "../middlewares/authenticator.js";

const router = Router();

router
  .route("/")
  .post(authenticate, agregarAlCarrito)
  .get(authenticate, obtenerCarrito)
  .delete(authenticate, vaciarCarrito);
//localhost:3003/api/carrito/restar/jsdhfjsd
//localhost:3003/api/carrito/servicio/jsdhfjsd
router.route('/restar/:servicioId').patch(authenticate, restarCantidadServicio)
router.route('/servicio/:servicioId').delete(authenticate,eliminarServicio)

export default router;
