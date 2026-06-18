import mongoose, { Schema } from "mongoose";

const servicioSchema = new Schema(
  {
    nombreServicio: {
      type: String,
      unique: true,
      required: true,
      minLength: 5,
      maxLength: 100,
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
      min: 50,
    },
    descripcion: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 500,
      trim: true,
    },
    imagen: {
      type: String,
      required: true,
      validate: {
        validator: (valor) => {
          return /^https:\/\/.+\.(jpg|jpeg|png|webp|avif|svg)$/.test(valor);
        },
      },
    },
    categoria: {
      type: String,
      required: true,
      enum: ["Desarrollo Web", "Backend & API", "Consultoría"],
    },
  },
  {
    timestamps: true,
  },
);

const Servicio = mongoose.model('servicio', servicioSchema) 

export default Servicio
