// Importando librerías
const express = require ("express");
const fs = require ("fs");
const { v4: uuidv4 } = require('uuid');
const axios = require("axios");
const path = require("path");

// Crea una instancia de Express
const app = express();

// Define el puerto en el que la aplicación escuchará
const port = 3000;

//Configurar el servidor para recibir payloads
app.use(express.json());

//Configurar el servidor para servir archivos estáticos
app.use(express.static(path.join(__dirname, "/index.html")));

// uuidv4().slice(30);

// Ruta raíz GET para servir index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Crea la ruta GET /roommates
app.get("/roommates", async (req, res) => {
  //Almacena en una variable el JSON del archivo Roommates.json
  const roommatesJSON = JSON.parse(fs.readFileSync("Roommates.json", "utf8"));
  //Devuelve al cliente el JSON de roommates
  res.send(roommatesJSON);
});

//Crea la ruta GET /gastos
app.get("/gastos", (req, res) => {
  //Almacena en una variable el JSON del archivo Gastos.json
  const gastosJSON = JSON.parse(fs.readFileSync("Gastos.json", "utf8"));
  //Devuelve al cliente el JSON de gastos
  res.send(gastosJSON);
});

// *Crear la ruta POST /gasto
app.post("/gasto", async (req, res) => {
  try {
    //Crea una variable nuevoGasto con las propiedades recibidas en el cuerpo de la consulta
    const roommate = roommateSelected;
    const { descripcion, monto } = req.query;
    const nuevoGasto = { id: uuidv4().slice(30), roommate , descripcion, monto };
    //Almacena en una variable la data del archivo Gastos.json y de su arreglo gastos
    const gastosJSON = JSON.parse(fs.readFileSync("Gastos.json", "utf8"));
    const gastos = gastosJSON.gastos;
    //Agrega el gasto creado en el arreglo del JSON
    gastos.push(nuevoGasto);
    // Sobrescribe el archivo Gastos.json con el arreglo nuevo
    fs.writeFileSync("Gastos.json", JSON.stringify(gastosJSON, null, 2));
    res.send("Gasto agregado con éxito");
  } catch (error) {
    console.error("Error al agregar gasto", error);
    res.status(500).send("Internal server error");
  }
});

// *Crear la ruta PUT /gasto
app.put("/gasto", async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, monto } = req.query;
    //Crea una variable editGasto con las propiedades recibidas en el cuerpo de la consulta
    const editGasto = { descripcion, monto };
    //Almacena en una variable la data del archivo Gastos.json y de su arreglo gastos
    const gastosJSON = JSON.parse(fs.readFileSync("Gastos.json", "utf8"));
    const gastos = gastosJSON.gastos;
    // Método map para sobrescribir el objeto
    gastosJSON.gastos = gastos.map(
      g => g.id ===id ? editGasto: g);
      // Sobrescribe el archivo Gastos.json con el arreglo modificado
      fs.writeFileSync("Gastos.json", JSON.stringify(gastosJSON, null, 2));
      res.send("Gasto editado con éxito");
    } catch (error) {
      console.error("Error al agregar gasto", error);
      res.status(500).send("Internal server error");
    }
  });

  // *Crear la ruta POST /roommate
  app.get("/roommate", async (req, res) => {
    try {
      // Crea un nuevo roommate
      const { data } = await axios.get("https://randomuser.me/api");
      const randomUser = await data.results[0];
      const roommate = {
        name: randomUser.name.first,
        lastname: randomUser.name.last,
        debe: req.query,
        recibe: req.query
      };
      const roommates = JSON.parse(fs.readFileSync("Roommates.json", "utf8"));
      roommates.push(roommate);
      // Sobrescribe el archivo Roommates.json con el nuevo roommate
      fs.writeFileSync("Roommates.json", JSON.stringify(roommates, null, 2));
      res.send();
    } catch (error) {
      console.error("Error al agregar roommate", error);
      res.status(500).send("Internal server error");
    }
  });

  // *Crear la ruta DELETE /gasto
  app.delete("/gasto", async (req, res) => {
    try {
      //Crea una variable nuevoGasto con las propiedades recibidas en el cuerpo de la consulta
      const { id } = req.query;
    //Almacena en una variable la data del archivo Gastos.json y de su arreglo gastos
    const gastosJSON = JSON.parse(fs.readFileSync("Gastos.json", "utf8"));
    const gastos = gastosJSON.gastos;
    // Filtra los datos recibidos a través del id
    gastosJSON.gastos = gastos.filter((g) => (g.id !== id));
    // Sobrescribe el archivo Gastos.json con el arreglo modificado
    fs.writeFileSync("Gastos.json", JSON.stringify(gastosJSON, null, 2));
    res.send("Gasto eliminado con éxito");
  } catch (error) {
    console.error("Error al eliminar gasto", error);
    res.status(500).send("Internal server error");
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(
    `Servidor escuchando en http://localhost:${port}, ${process.pid}`
  );
});
