import { MercadoPagoConfig, Preference } from "mercadopago";
import buscarOcrearCarrito from "../utils/buscarOcrearCarrito.js";
import Orden from "../models/orden.js";


const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export const crearPreferenciaPago = async (req, res) => {
  try {
    const userId = req.user.id;
    const carrito = await buscarOcrearCarrito(userId);
    // todo: aclarar los datos del servicio que necesito
    await carrito.populate("items.servicio");
    //verificar si el carrito esta vacio
    if (carrito.items.length === 0) {
      return res.status(400).json({ mensaje: "El carrito esta vacio" });
    }

    // verificar los items del carrito para saber el montoTotal, crear la orden de pago y la preferencia de pago
    let montoTotal = 0;
    // creamos un array con los items para mercadoPago
    const itemsMP = carrito.items.map((item) => {
      const subTotal = item.servicio.precio * item.cantidad;
      montoTotal += subTotal;
      return {
        id: item.servicio._id.toString(),
        title: item.servicio.nombreServicio,
        unit_price: Number(item.servicio.precio),
        quantity: Number(item.cantidad),
        currency_id: "ARS",
        picture_url: item.servicio.imagen,
      };
    });
    // creamos un array con los items para la orden
    const itemsOrden = carrito.items.map((item) => ({
      servicio: item.servicio._id,
      nombreServicio: item.servicio.nombreServicio,
      precioUnitario: item.servicio.precio,
      cantidad: item.cantidad,
    }));

    //crear la orden de pago
    const nuevaOrden = new Orden({
        usuario: userId,
        items: itemsOrden,
        montoTotal,
        estado: 'pendiente'
    })

    await nuevaOrden.save()

    //crear la preferencia de pago
    const preference = new Preference(client)

    const result = await preference.create({
        body:{
            items: itemsMP,
            external_reference: nuevaOrden._id.toString(),
            //webhook
            back_urls:{
                success: `${process.env.PAYMENT_FRONTEND_URL}/checkout/resultado?status=success`,
                failure: `${process.env.PAYMENT_FRONTEND_URL}/checkout/resultado?status=failure`,
                pending: `${process.env.PAYMENT_FRONTEND_URL}/checkout/resultado?status=pending`
            },
            auto_return: "approved"
        }
    })

    //actualizar la orden con el id de la preferencia
    nuevaOrden.preferenceId = result.id
    await nuevaOrden.save()

    res.status(201).json({
        mensaje: 'La preferencia de pago fue creada con exito',
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point,
        ordenId: nuevaOrden._id
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al crear la preferencia de pago" });
  }
};
