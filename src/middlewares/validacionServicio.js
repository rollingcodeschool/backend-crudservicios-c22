import { body, param } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";
import Servicio from "../models/servicio.js";

const reglasServicio = [
  body("nombreServicio")
    .isString()
    .withMessage("El nombre del servicio debe ser un string")
    .isLength({ min: 5, max: 100 })
    .withMessage(
      "El nombre del servicio debe contener entre 5 y 100 caracteres",
    )
    .custom(async (valor, {req})=>{
        const servicioExistente = await Servicio.findOne({nombreServicio:valor})
        if(!servicioExistente){
            return true
        }
        throw new Error('El servicio ya existe en la base de datos')
    })
    ,
  body("precio")
    .isNumeric()
    .withMessage("El precio debe ser en formato numerico")
    .isFloat({ min: 50 })
    .withMessage("El precio no puede ser menor a $50"),
  body("descripcion")
    .isString()
    .withMessage("La descripción debe ser un string")
    .isLength({ min: 10, max: 500 })
    .withMessage("La descripción debe contener entre 10 y 500 caracteres"),
  body("imagen")
    .isString()
    .withMessage("La imagen debe ser un string")
    .matches(/^https:\/\/.+\.(jpg|jpeg|png|webp|avif|svg)$/)
    .withMessage(
      "La imagen debe ser una url valida y debe terminar con jpg|jpeg|png|webp|avif|svg",
    ),
  body("categoria")
    .isString()
    .withMessage("La categoria debe ser un string")
    .isIn(["Desarrollo Web", "Backend & API", "Consultoría"])
    .withMessage("La categoria debe ser una de las siguientes opciones: 'Desarrollo Web', 'Backend & API', 'Consultoría' "),
];

// para el post y put
export const validacionServicio = [
    ...reglasServicio.map((regla)=> regla.notEmpty().withMessage('El campo es un dato obligatorio')), resultadoValidacion
]

export const validacionPatchServicio = [
    ...reglasServicio.map((regla)=> regla.optional({values:"falsy"})), resultadoValidacion
]

//para el patch

export const validacionIDServicio = [
    param('id').isMongoId().withMessage('El id enviado no tiene el formato de ID de mongoDB'), resultadoValidacion
]