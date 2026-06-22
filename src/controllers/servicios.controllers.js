import Servicio from "../models/servicio.js"

export const prueba = (req, res)=>{
    const vehiculos = ['🏎️', '🚗', '🚕']
    
    res.json({
        mensaje: 'Bienvenidos a nuestro backend',
        vehiculos
    })
}

export const crearServicio = async (req, res)=>{
    try{
        //luego agregamos la validacion
        const servicioNuevo = new Servicio(req.body)
        await servicioNuevo.save()
        //ahora debo dar de alta el servicio en la BD
        res.status(201).json({mensaje: 'El servicio fue creado correctamente'})
    }catch(error){
        console.error(error)
        res.status(500).json({mensaje: 'Ocurrio un error al intentar crear un servicio'})
    }
}

