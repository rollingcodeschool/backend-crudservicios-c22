import Servicio from "../models/servicio.js";

export const prueba = (req, res) => {
  const vehiculos = ["🏎️", "🚗", "🚕"];

  res.json({
    mensaje: "Bienvenidos a nuestro backend",
    vehiculos,
  });
};

export const crearServicio = async (req, res) => {
  try {
    //luego agregamos la validacion
    const servicioNuevo = new Servicio(req.body);
    await servicioNuevo.save();
    //ahora debo dar de alta el servicio en la BD
    res.status(201).json({ mensaje: "El servicio fue creado correctamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al intentar crear un servicio" });
  }
};

export const listarServicios = async (req, res) => {
  try {
    console.log(req.query);
    const { termino, pagina, limite } = req.query;
    const numeroPagina = parseInt(pagina);
    const nuevoLimite = parseInt(limite);

    const salto = (numeroPagina - 1) * nuevoLimite;
    console.log(salto);
    //filtro por termino
    const query = {};
    //verificar si tenemos algun termino de busqueda
    if (termino) {
      query.nombreServicio = { $regex: termino, $options: "i" };
    }

    const [servicios, cantidadServicios] = await Promise.all([
      Servicio.find(query)
        .populate("categoria", "nombre descripcion")
        .skip(salto)
        .limit(nuevoLimite),
      Servicio.countDocuments(query),
    ]);
    // consultas individuales
    // const servicios = await Servicio.find(query).populate(
    //   "categoria",
    //   "nombre descripcion",
    // );
    // const cantidadServicios = await Servicio.countDocuments(query)

    res
      .status(200)
      .json({ 
        servicios, 
        cantidadServicios, 
        paginaActual: numeroPagina || 0,
        totalPaginas:  Math.ceil(cantidadServicios/nuevoLimite) || 0
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al intentar crear un servicio" });
  }
};

export const buscarServicioPorID = async (req, res) => {
  try {
    const servicioBuscado = await Servicio.findById(req.params.id).populate(
      "categoria",
      "nombre descripcion",
    );
    if (!servicioBuscado) {
      return res
        .status(404)
        .json({ mensaje: "No se encontro un servicio con el id enviado" });
    }
    res.status(200).json(servicioBuscado);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Ocurrio un error al intentar buscar un servicio por id",
    });
  }
};
export const borrarServicioPorID = async (req, res) => {
  try {
    const servicioBorrado = await Servicio.findByIdAndDelete(req.params.id);
    if (!servicioBorrado) {
      return res
        .status(404)
        .json({ mensaje: "No se encontro un servicio con el id enviado" });
    }
    res.status(200).json({ mensaje: "El servicio se elimino correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Ocurrio un error al intentar eliminar un servicio por id",
    });
  }
};
export const editarServicioPorID = async (req, res) => {
  try {
    const servicioEditado = await Servicio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!servicioEditado) {
      return res
        .status(404)
        .json({ mensaje: "No se encontro un servicio con el id enviado" });
    }
    res.status(200).json({
      mensaje: "El servicio se actualizo correctamente",
      servicio: servicioEditado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Ocurrio un error al intentar editar un servicio por id",
    });
  }
};
