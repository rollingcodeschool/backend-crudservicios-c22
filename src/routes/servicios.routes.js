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
import upload from "../middlewares/upload.js";
import errorMulter from "../middlewares/errorMulter.js";

const router = Router();
//http://localhost:3000/api/servcicios/
// get - post - put- delete -patch
router.route("/test").get(prueba);
router
  .route("/")
  .get(listarServicios)
  .post([authenticate, isAdmin, upload.single('imagen'), errorMulter , validacionServicio],  crearServicio);
  // .post([authenticate, isAdmin, validacionServicio], crearServicio) //ruta privada
router
  .route("/:id")
  .get(validacionIDServicio, buscarServicioPorID)
  .delete([authenticate, isAdmin, validacionIDServicio], borrarServicioPorID)//ruta privada
  .put(
    [authenticate, isAdmin,upload.single('imagen'), errorMulter , validacionIDServicio, validacionServicio],
    editarServicioPorID,
  )//ruta privada
  .patch([validacionIDServicio, validacionPatchServicio], editarServicioPorID);

export default router;
