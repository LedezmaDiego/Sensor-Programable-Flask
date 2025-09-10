import express from "express";
// Importar el pool de conexiones porque vamos a
// usar la base de datos MySQL
import pool from "./db.js";

const app = express();
const PORT = 4000; // Constante Real, porque esta en MAYUSCULAS

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Terraria es saludable :v");
});

// query params
app.get("/api/search", (req, res) => {
  const { name, lastname } = req.query;
  res.json({ firstName: name, lastname });
  // http://localhost:PUERTO/api/search?name=Diego&lastname=Ajata
});

// endpoint con metodo POST
app.post("/api/user", (req, res) => {
  const { name, email } = req.body;
  res.json({ message: "Usuario Creado", data: { name, email } });
});

// endpoint con parametro
app.get("/api/user/:id", (req, res) => {
  // destructuracion
  const { id } = req.params;

  if (typeof id === "string") {
    const idInt = parseInt(id);
    console.log(idInt);
  }

  //   res.send({ message: `El usuario con id ${id} es papu` });
  res.json({ message: `Este es el usuario con el id ${id}` });
});

// PUT (en Postman)
app.put("/api/user/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  res.json({
    message: `Usuario con ID ${id} editado`,
    data: { name, email },
  });
});

// DELETE (en Postman)
app.delete("/api/user/:id", (req, res) => {
  const { id } = req.params;

  res.json({
    message: `Usuario con ID ${id} borrado`,
  });
});

// endpoints con base de datos
// GET
// async es una funcion que se ejecuta de manera acronica, es decir, no bloquea el hilo principal
// await es una palabra reservada que se usa para esperar a que una promesa se resuelva
app.get("/api/products", async (req, res) => {
  try {
    //codigo a probar
    const [rows] = await pool.query("SELECT * FROM bocadillos");
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error en la consulta de los sabores" });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
