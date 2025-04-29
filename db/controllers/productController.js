const db = require("../../db/db");

const getProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json(err);
    // Map each product to ensure it has a proper image path
    const productsWithImages = results.map((product) => ({
      ...product,
      image: product.image || `/images/produit${product.id}.png`,
    }));
    res.json(productsWithImages);
  });
};

const addProduct = (req, res) => {
  const { name, price, description, stock } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : null;

  const sql =
    "INSERT INTO products (name, price, description, stock, image) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, price, description, stock, image], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({
      id: result.insertId,
      name,
      price,
      description,
      image,
    });
  });
};

module.exports = { getProducts, addProduct };
