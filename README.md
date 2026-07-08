# Conceptos de NodeJS

Este proyecto es una practica de los primeros conceptos de nodejs, donde implementaremos middlewares, endpoints y fue construido con pnpm como gestor de paquetes.

## Demo del backend

Podes ver una demo del proyecto en producción [aqui](https://conceptos-nodejs-c22.vercel.app/)

## Librerias utilizadas

- Nodejs v24.4 o cualquier version posterior a la 22.
- ExpressJS
- Cors
- Morgan 

## Instalacion y configuración del proyecto

1- Clonar el repositorio

`git clone https://github.com/rollingcodeschool/conceptosNodejs-c22.git`

2- Instalar las dependencias 

`pnpm install`

3- Iniciar aplicacion:

```bash
# comando de producción
pnpm start

# comando de desarrollo
pnpm run dev
```

## Endpoints

```bash
# Metodo: Get
/api/saludo
# Descripcion: Este endpoint devuelve un saludo y un array de vehiculos

# Metodo: Get
/api/adios
# Descripcion: Este endpoint devuelve mensaje de adios
```
- Método: POST
- Endpoint: https://backend-crudservicios-c22.onrender.com/api/servicios
- Descripcion: Este endpoint crea un servicio

- Body: 
```
{
    "nombreServicio": "Diseño de API 20",
    "precio": 50000,
    "imagen": "https://images.pexels.com/photos/39284/macbook-apple-imac-computer-39284.jpeg",
    "categoria": "Backend & API",
    "descripcion": "Desarrollo web de 5 paginas"
}
```

Codigos de respuesta:
 - 201: Created
 - 400: Bad request
 - 500: Error interno del servidor

# Autor

Arias Emilse