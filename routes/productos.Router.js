const express = require("express");

const { Router } = express;
const productosRouter = new Router();

const Productos = require("../models/Productos");

const productosApi = new Productos("./db/productos.txt");

const crearErrorNoEsAdmin = (ruta, metodo) => {
  const error = {
    error: -1,
  };
  if (ruta && metodo) {
    error.descripcion = `ruta '${ruta}' método '${metodo}' no autorizado`;
  } else {
    error.descripcion = `No autroizado`;
  }
  return error;
};

const esAdmin = true;

const soloAdmin = (req, res, next) => {
  if (!esAdmin) {
    res.json(crearErrorNoEsAdmin(req.url, req.method));
  } else {
    next();
  }
};

productosRouter.get("/", async (req, res) => {
  const productos = await productosApi.listAll();
  res.json(productos);
});

productosRouter.get("/:id", async (req, res) => {
  let { id } = req.params;
  const producto = await productosApi.list(id);
  res.json(producto);
});

productosRouter.post("/", soloAdmin, async (req, res) => {
  let idProductoNuevo = await productosApi.save(req.body);
  res.send({ productoNuevo: idProductoNuevo });
});

productosRouter.put("/:id", soloAdmin, async (req, res) => {
  let { id } = req.params;
  let producto = await productosApi.update(req.body, id);
  if (producto) {
    res.send("Producto Modificado");
  } else {
    res.json({ error: "producto no encontrado" });
  }
});

productosRouter.delete("/:id", soloAdmin, async (req, res) => {
  let { id } = req.params;
  let producto = await productosApi.delete(id);
  if (producto) {
    res.send("Producto Eliminado");
  } else {
    res.json({ error: "producto no encontrado" });
  }
});

module.exports = productosRouter;
