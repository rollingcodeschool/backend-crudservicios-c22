import { Router } from "express";
import {
  borrarServicioPorID,
  buscarServicioPorID,
  crearServicio,
  editarServicioPorID,
  listarServicios,
  prueba,
} from "../controllers/servicios.controllers.js";
import {
  validacionIDServicio,
  validacionPatchServicio,
  validacionServicio,
} from "../middlewares/validacionServicio.js";
import { authenticate, isAdmin } from "../middlewares/authenticator.js";

const router = Router();
//http://localhost:3000/api/servcicios/
// get - post - put- delete -patch
router.route("/test").get(prueba);
router
  .route("/")
  .post([authenticate, isAdmin, validacionServicio], crearServicio) //ruta privada
  .get(listarServicios);
router
  .route("/:id")
  .get(validacionIDServicio, buscarServicioPorID)
  .delete([authenticate, isAdmin, validacionIDServicio], borrarServicioPorID)//ruta privada
  .put(
    [authenticate, isAdmin, validacionIDServicio, validacionServicio],
    editarServicioPorID,
  )//ruta privada
  .patch([validacionIDServicio, validacionPatchServicio], editarServicioPorID);

export default router;
