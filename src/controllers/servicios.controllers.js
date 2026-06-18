export const prueba = (req, res)=>{
    const vehiculos = ['🏎️', '🚗', '🚕']
    
    res.json({
        mensaje: 'Bienvenidos a nuestro backend',
        vehiculos
    })
}

export const crearServicio = async (req, res)=>{
    try{
        console.log(req.body)
        //ahora debo dar de alta el servicio en la BD
    }catch(error){
        console.error(error)
        res.status(500).json({mensaje: 'Ocurrio un error al intentar crear un servicio'})
    }
}

