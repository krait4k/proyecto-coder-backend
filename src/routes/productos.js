const express = require('express');
const router = express.Router();
const { readFile, writeFile, productsFilePath } = require('../utils/fileManager');

router.get('/', async (req, res) => {
  const limit = req.query.limit;
  const products = await readFile(productsFilePath);
  if (limit) {
    return res.json(products.slice(0, limit));
  }
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const products = await readFile(productsFilePath);
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(product);
});

router.post('/', async (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const products = await readFile(productsFilePath);
  const newProduct = {
    id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };

  products.push(newProduct);
  await writeFile(productsFilePath, products);
  res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const products = await readFile(productsFilePath);
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const updatedProduct = { ...products[productIndex], ...req.body };
  products[productIndex] = updatedProduct;

  await writeFile(productsFilePath, products);
  res.json(updatedProduct);
});

router.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;
  let products = await readFile(productsFilePath);
  const newProducts = products.filter(p => p.id !== productId);

  if (newProducts.length === products.length) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  await writeFile(productsFilePath, newProducts);
  res.status(200).json({ message: 'Producto eliminado' });
});

module.exports = router;