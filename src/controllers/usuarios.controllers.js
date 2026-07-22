import Usuario from "../models/usuario.js";
import { transporter } from "../utils/mailer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    res.status(500).json({
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

    const tiempoExpiracion = new Date(Date.now() + 15 * 60 * 1000); // el tiempo configurado son 15 min
    console.log(codigoVerificacion);
    console.log(Date.now() + 15 * 60 * 1000);
    console.log(tiempoExpiracion);

    //preparar los datos para guardar en la BD
    const datosUsuario = {
      nombre,
      email,
      password,
      verificationCode: codigoVerificacion,
      verificationExpires: tiempoExpiracion,
    };

    if (rol && rol.trim() !== "") {
      datosUsuario.rol = rol;
    }

    const nuevoUsuario = await Usuario.create(datosUsuario);
    //enviar el correo con el codigo de verificacion
    await transporter.sendMail({
      from: '"Crud Servicios" <no-reply@crud-servicios.com>',
      to: email,
      subject: "🔑 Código de Verificación de Cuenta",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">¡Hola, ${nombre}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Gracias por registrarte. Para activar tu cuenta y poder ingresar a la plataforma, por favor utiliza el siguiente código de verificación:
          </p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 4px; color: #007bff;">
            ${codigoVerificacion}
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">
            Este código vencerá en 15 minutos. Si no solicitaste este registro, puedes ignorar este correo de forma segura.
          </p>
        </div>
      `,
    });
    //enviamos la respuesta al frontend
    res.status(201).json({
      mensaje:
        "Usuario registrado exitosamente. Por favor, revisa tu email para verificar tu cuenta.",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al intentar registrar un usuario" });
  }
};

//confirmar codigo de verificacion
export const confirmarCodigoVerificacion = async (req, res) => {
  try {
    const { email, codigo } = req.body;

    const usuarioBuscado = await Usuario.findOne({ email });
    if (!usuarioBuscado) {
      return res
        .status(404)
        .json({ mensaje: "No se encontró ningún usuario con ese email" });
    }
    // chequear si el usuario esta verificado
    if (usuarioBuscado.isVerified) {
      return res.status(400).json({ mensaje: "Esta cuenta ya fue verificada" });
    }

    // verificar si el codigo ya expiro
    if (new Date() > usuarioBuscado.verificationExpires) {
      return res.status(400).json({
        mensaje: "El código de verificación a expirado. Solicita uno nuevo",
      });
    }

    //verificar que el codigo enviado es el mismo que el que esta almacenado
    if (usuarioBuscado.verificationCode !== codigo) {
      return res
        .status(400)
        .json({ mensaje: "El código enviado es incorrecto" });
    }

    //verificar el codigo
    await Usuario.findByIdAndUpdate(usuarioBuscado._id, {
      $set: { isVerified: true },
      $unset: { verificationCode: 1, verificationExpires: 1 },
    });

    res.status(200).json({
      mensaje: "Cuenta verificada con exito. Ya puedes iniciar sesion",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Ocurrio un error al intentar verifica el codigo enviado",
    });
  }
};

//reenviar el codigo de verificacion
export const solicitarNuevoCodigo = async (req, res) => {
  try {
    const { email } = req.body;

    const usuarioBuscado = await Usuario.findOne({ email });
    if (!usuarioBuscado) {
      return res
        .status(404)
        .json({ mensaje: "No se encontró un usuario con ese email" });
    }

    //validar que el codigo no este verificado
    if (usuarioBuscado.isVerified) {
      return res.status(400).json({ mensaje: "Esta cuenta ya fue verificada" });
    }

    // verifica si ya vencio el codigo generado y recien expirado entonces vuelvo a crear el codigo de verificacion
    // if (new Date() < usuarioBuscado.verificationExpires) {
    //   return res.status(400).json({
    //     mensaje: "El código de verificación a expirado. Solicita uno nuevo",
    //   });
    // }

    // generar un nuevo codigo y calcular el tiempo
    const codigoVerificacion = Math.floor(
      100000 + Math.random() * 900000,
    ).toString(); // 100000 - 999999

    const tiempoExpiracion = new Date(Date.now() + 15 * 60 * 1000);

    //actualizar el codigo en el usuario de la BD
    await Usuario.findByIdAndUpdate(usuarioBuscado._id, {
      verificationCode: codigoVerificacion,
      verificationExpires: tiempoExpiracion,
    });
    //reenviar el correo
    await transporter.sendMail({
      from: '"Crud Servicios" <no-reply@crud-servicios.com>',
      to: email,
      subject: "🔑 Nuevo código de Verificación de Cuenta",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">¡Hola, ${usuarioBuscado.nombre}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Gracias por registrarte. Para activar tu cuenta y poder ingresar a la plataforma, por favor utiliza el siguiente código de verificación:
          </p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 4px; color: #007bff;">
            ${codigoVerificacion}
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">
            Este código vencerá en 15 minutos. Si no solicitaste este registro, puedes ignorar este correo de forma segura.
          </p>
        </div>
      `,
    });
    //enviar respuesta
    res
      .status(200)
      .json({ mensaje: "Se creo un nuevo código de verificación" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje:
        "Ocurrio un error al intentar crear el nuevo codigo de verificacion",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //verificamos que el email exista
    const usuarioBuscado = await Usuario.findOne({ email });
    if (!usuarioBuscado) {
      return res.status(401).json({ mensaje: "credenciales invalidas" });
    }
    //verificar que el password sea el correcto
    if (!(await bcrypt.compare(password, usuarioBuscado.password))) {
      return res.status(401).json({ mensaje: "credenciales invalidas" });
    }
    //chequear si la cuenta del usuario esta verificada
    if (!usuarioBuscado.isVerified) {
      return res
        .status(403)
        .json({ mensaje: "La cuenta aún no fue verificada." });
    }
    //generar y firmar el token
    const token = jwt.sign(
      { id: usuarioBuscado._id, rol: usuarioBuscado.rol },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, //1 hora
    });

    res
      .status(200)
      .json({ mensaje: "Login exitoso", usuario: usuarioBuscado.nombre });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al intentar loguear al usuario" });
  }
};

export const obtenerPerfil = async (req, res) => {
  try {
    //buscar la informacion del usuario
    const usuarioBuscado = await Usuario.findById(req.user.id).select("-password -isVerified -createdAt -updatedAt")
    console.log(usuarioBuscado);
    if(!usuarioBuscado){
      return res.status(404).json({mensaje: 'Usuario no encontrado'})
    }
    // res.status(200).json({
    //   nombre: usuarioBuscado.nombre,
    //   email: usuarioBuscado.email,
    //   rol: usuarioBuscado.rol
    // });
    res.status(200).json(usuarioBuscado);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al obtener el perfil del usuario" });
  }
};
