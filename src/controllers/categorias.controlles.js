import Categoria from "../models/categoria.js"

// todo: agregar los controladores para editar, borrar y obtener una categoria

export const crearCategoria = async (req, res)=>{
    try {
        //agregar las validaciones con express-validor
        const nuevaCategoria = new Categoria(req.body)
        await nuevaCategoria.save();
        res.status(201).json({mensaje:'Categoria creada correctamente'})
    } catch (error) {
        console.error(error)
        res.status(500).json({mensaje: 'Ocurrio un error al crear la categoria'})
    }
}
export const listarCategorias = async (req, res)=>{
    try {
        const categorias = await Categoria.find()
        res.status(200).json(categorias)
    } catch (error) {
        console.error(error)
        res.status(500).json({mensaje: 'Ocurrio un error al listar las categorias'})
    }
}