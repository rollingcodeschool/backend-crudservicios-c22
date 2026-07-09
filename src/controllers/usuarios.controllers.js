import Usuario from "../models/usuario.js";

export const crearUsuario = async (req, res) => {
  try {
    const usuarioNuevo = new Usuario(req.body);
    await usuarioNuevo.save();
    res.status(201).json({ mensaje: "El usuario fue creado correctamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al intentar crear un usuario" });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al intentar crear un servicio" });
  }
};

export const buscarUsuarioPorID = async (req, res) => {
  try {
    const usuarioBuscado = await Usuario.findById(req.params.id);
    if (!usuarioBuscado) {
      return res
        .status(404)
        .json({ mensaje: "No se encontro un usuario con el id enviado" });
    }
    res.status(200).json(usuarioBuscado);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        mensaje: "Ocurrio un error al intentar buscar un usuario por id",
      });
  }
};

export const registroUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    //verificar si el mail ya existe
    // const usuarioExistente = await Usuario.findOne({email: req.body.email})
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ mensaje: "El email ya está registrado" });
    }
    //generar el codigo de verificacion y el tiempo de expiracion
    const codigoVerificacion = Math.floor(
      100000 + Math.random() * 900000,
    ).toString(); // 100000 - 999999

    const tiempoExpiracion = new Date(Date.now() + 15 * 60 * 1000) // el tiempo configurado son 15 min
    console.log(codigoVerificacion);
    console.log(tiempoExpiracion);

    //preparar los datos para guardar en la BD
    const datosUsuario = {
        nombre,
        email,
        password,
        verificationCode: codigoVerificacion,
        verificationExpires: tiempoExpiracion
    }

    if( rol && rol.trim() !== ""){
        datosUsuario.rol = rol
    }

    const nuevoUsuario = await Usuario.create(datosUsuario)
    //enviar el correo con el codigo de verificacion

  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al intentar registrar un usuario" });
  }
};
