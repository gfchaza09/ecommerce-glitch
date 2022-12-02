const express = require("express");

const { Router } = express;
const carritoRouter = new Router();

const Carrito = require("../models/Carrito.js");

const carritoApi = new Carrito("./db/carrito.txt");

carritoRouter.post("/", async (req, res) => {
  let idCarritoNuevo = await carritoApi.save();
  res.send({ idCarrito: idCarritoNuevo });
});

carritoRouter.delete("/:id", async (req, res) => {
  let { id } = req.params;
  let carrito = await carritoApi.delete(id);
  if (carrito) {
    res.send("Carrito Eliminado");
  } else {
    res.json({ error: "carrito no encontrado" });
  }
});

carritoRouter.get("/:id/productos", async (req, res) => {
  let { id } = req.params;
  const carritoProductos = await carritoApi.list(id);
  res.json(carritoProductos);
});

carritoRouter.post("/:id/productos", async (req, res) => {
  let { id } = req.params;
  let carritoProductos = await carritoApi.update(req.body, id);
  if (carritoProductos) {
    res.send("Carrito Modificado");
  } else {
    res.json({ error: "carrito no encontrado" });
  }
});

carritoRouter.delete("/:id/productos/:id_prod", async (req, res) => {
  let { id, id_prod } = req.params;
  let carrito = await carritoApi.deleteProductCart(id, id_prod);
  if (carrito) {
    res.send("Producto Eliminado");
  } else {
    res.json({ error: "producto no encontrado" });
  }
});

module.exports = carritoRouter;
