const cors = require("cors");
const express = require("express");
const ProductosRouter = require("./routes/productos.Router");
const CarritoRouter = require("./routes/carrito.Router");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// servidor

app.use("/api/productos", ProductosRouter);
app.use("/api/carrito", CarritoRouter);

app.use((req, res, next) => {
  res.status(404).send({
    error: "-2",
    description: `ruta '${req.url}' método '${req.method}' no implementado`,
  });
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
