const fs = require("fs");

class Carrito {
  constructor(route) {
    this.route = route;
  }

  async list(id) {
    const carts = await this.listAll();
    try {
      const cart = carts.find((prod) => prod.id === parseInt(id));
      return cart ? cart.products : null;
    } catch (error) {
      console.log(error);
    }
  }

  async listAll() {
    try {
      const carts = await fs.promises.readFile(this.route, "utf-8");
      return JSON.parse(carts);
    } catch (error) {
      console.log(error);
    }
  }

  async save() {
    const carts = await this.listAll();

    try {
      let timestamp = Date.now();
      let id;
      carts.length === 0 ? (id = 1) : (id = carts[carts.length - 1].id + 1);
      const newCart = { products: [], id, timestamp };
      carts.push(newCart);
      await this.writeFile(carts);
      return newCart.id;
    } catch (error) {
      console.log(error);
    }
  }

  async update(prod, id) {
    const carts = await this.listAll();
    try {
      const updatedCart = carts.find((cart) => cart.id === parseInt(id));
      if (updatedCart) {
        updatedCart.products = [...updatedCart.products, prod];
        await this.writeFile(carts);
        return updatedCart;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id) {
    const carts = await this.listAll();
    try {
      const cart = carts.find((cart) => cart.id === parseInt(id));
      if (cart) {
        cart.products = [];
      }
      const newCarts = carts.filter((prod) => prod.id !== parseInt(id));
      await this.writeFile(newCarts);
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductCart(id, prodId) {
    const carts = await this.listAll();
    try {
      const cart = carts.find((cart) => cart.id === parseInt(id));
      if (cart.products) {
        const prod = cart.products.find((prod) => prod.id === parseInt(prodId));
        if (prod) {
          cart.products = cart.products.filter(
            (prod) => prod.id !== parseInt(prodId)
          );
        }
        await this.writeFile(carts);
        return prod;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAll() {
    await this.writeFile([]);
  }

  async writeFile(data) {
    try {
      await fs.promises.writeFile(this.route, JSON.stringify(data, null, 2));
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Carrito;
