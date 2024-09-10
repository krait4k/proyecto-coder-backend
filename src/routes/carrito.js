const express = require('express');
const router = express.Router();
const { readFile, writeFile, cartsFilePath, productsFilePath } = require('../utils/fileManager');

router.post('/', async (req, res) => {
  const carts = await readFile(cartsFilePath);
  
  const newCart = {
    id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
    products: []
  };

  carts.push(newCart);
  await writeFile(cartsFilePath, carts);
  
  res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const carts = await readFile(cartsFilePath);
  const cart = carts.find(c => c.id === parseInt(cartId));

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const carts = await readFile(cartsFilePath);
  const products = await readFile(productsFilePath);

  const cart = carts.find(c => c.id === parseInt(cartId));
  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const product = products.find(p => p.id === parseInt(productId));
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const cartProduct = cart.products.find(p => p.product === parseInt(productId));
  if (cartProduct) {
    cartProduct.quantity += 1;
  } else {
    cart.products.push({ product: parseInt(productId), quantity: 1 });
  }

  await writeFile(cartsFilePath, carts);
  
  res.status(200).json(cart);
});

module.exports = router;