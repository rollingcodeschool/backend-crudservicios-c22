import { Router } from "express";
import { buscarUsuarioPorID, confirmarCodigoVerificacion, crearUsuario, listarUsuarios, login, obtenerPerfil, registroUsuario, solicitarNuevoCodigo } from "../controllers/usuarios.controllers.js";
import { authenticate, isAdmin } from "../middlewares/authenticator.js";

const router = Router();

router.route('/').post(crearUsuario).get([authenticate, isAdmin],listarUsuarios) //ruta privada - admin
router.route('/registrar').post(registroUsuario)
router.route('/verificar').post(confirmarCodigoVerificacion)
router.route('/reenviar-codigo').post(solicitarNuevoCodigo)
router.route('/login').post(login)
//ruta privada
router.route('/perfil').get(authenticate, obtenerPerfil)

router.route('/:id').get(buscarUsuarioPorID)
export default router