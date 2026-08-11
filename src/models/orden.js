import mongoose, { Schema } from "mongoose";

const ordenSchema = new Schema({
    usuario:{
        type: Schema.Types.ObjectId,
        ref:"usuario",
        required: true
    },
    items: [
      {
        servicio: {
          type: Schema.Types.ObjectId,
          ref: "servicio",
          required: true,
        },
        nombreServicio: {
            type: String,
            required:true
        },
        precioUnitario:{
            type: Number,
            required:true
        },
        cantidad: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    montoTotal:{
        type: Number,
        required:true
    }
})