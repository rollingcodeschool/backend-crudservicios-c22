import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

export const validacionServicio = [
  body("nombreServicio")
    .notEmpty()
    .withMessage("El nombre del servicio es un dato obligatorio")
    .isString()
    .withMessage('El nombre del servicio debe ser un string')
    ,
    resultadoValidacion
];
