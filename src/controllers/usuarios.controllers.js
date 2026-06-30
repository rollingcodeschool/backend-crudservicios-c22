import Usuario from "../models/usuario.js"

export const crearUsuario = async (req, res)=>{
    try{
        const usuarioNuevo = new Usuario(req.body)
        await usuarioNuevo.save()
        res.status(201).json({mensaje: 'El usuario fue creado correctamente'})
    }catch(error){
        console.error(error)
        res.status(500).json({mensaje: 'Ocurrio un error al intentar crear un usuario'})
    }
}

export const listarUsuarios = async (req, res)=>{
    try{
       const usuarios = await Usuario.find()
       res.status(200).json(usuarios)
    }catch(error){
        console.error(error)
        res.status(500).json({mensaje: 'Ocurrio un error al intentar crear un servicio'})
    }
}

export const buscarUsuarioPorID = async (req, res)=>{
    try{
       const usuarioBuscado = await Usuario.findById(req.params.id)
       if(!usuarioBuscado){
         return res.status(404).json({mensaje: 'No se encontro un usuario con el id enviado'})
       }
       res.status(200).json(usuarioBuscado)
    }catch(error){
        console.error(error)
        res.status(500).json({mensaje: 'Ocurrio un error al intentar buscar un usuario por id'})
    }
}