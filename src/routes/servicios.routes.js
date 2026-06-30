import { Router } from "express";
import { borrarServicioPorID, buscarServicioPorID, crearServicio, editarServicioPorID, listarServicios, prueba } from "../controllers/servicios.controllers.js";
import { validacionIDServicio, validacionPatchServicio, validacionServicio } from "../middlewares/validacionServicio.js";

const router = Router();
//http://localhost:3000/api/servcicios/
// get - post - put- delete -patch
router.route('/test').get(prueba)
router.route('/').post(validacionServicio,crearServicio).get(listarServicios)
router.route('/:id').get(validacionIDServicio,buscarServicioPorID).delete(validacionIDServicio,borrarServicioPorID).put([validacionIDServicio, validacionServicio],editarServicioPorID).patch([validacionIDServicio, validacionPatchServicio ], editarServicioPorID)

export default router