const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db/db'); // <-- Only declare this ONCE at the top

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const { getProducts, addProduct } = require('../db/controllers/productController');
router.get('/', getProducts);
router.post('/', upload.single('image'), addProduct);  // Add multer middleware here

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  console.log('Attempting to delete product with ID:', id);

  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json({ message: 'Produit supprimé avec succès' });
  });
});
router.put('/:id', (req, res) => {
    const { name, price, description, stock } = req.body;
    const sql = 'UPDATE products SET name=?, price=?, description=?, stock=?, image=? WHERE id=?';
    db.query(sql, [name, price, description, stock, image, req.params.id], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Produit mis à jour' });
    });
  });
  
router.get('/search/:term', (req, res) => {
    const term = req.params.term;
    const sql = 'SELECT * FROM products WHERE name LIKE ?';
    db.query(sql, [`%${term}%`], (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  });
  
module.exports = router;
