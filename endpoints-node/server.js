import express from 'express';

const app = express();
const PORT = 4000; // Constante Real, porque esta en MAYUSCULAS

app.use(express.json());

app.get('/', (req, res) =>{
    res.send('Terraria es saludable :v');
})

// endpoint con parametro
app.get('/api/user/:id', (req, res) =>{
    // destructuracion
    const {id} = req.params;
    res.send({message: `El usuario con id ${id} es papu`})
})

// query params
app.get('/api/search', (req, res) =>{
    const {name, lastname} = req.query;
    res.json({firstName: name, lastname});
    // http://localhost:PUERTO/api/search?name=Diego&lastname=Ajata
})

// endpoint con metodo POST
app.post('/api/user', (req, res) =>{
    const {name, email} = req.body;
    res.json({message: 'Usuario Creado', data: {name, email}})
})

// Iniciar el servidor
app.listen(PORT, () =>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})

