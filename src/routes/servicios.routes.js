import { Router } from "express";

const router = Router();
//http://localhost:3000/api/servcicios/test
router.route('/test').get( (req, res)=>{
    const vehiculos = ['🏎️', '🚗', '🚕']
    
    res.json({
        mensaje: 'Bienvenidos a nuestro backend',
        vehiculos
    })
})

export default router