const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/order', (req, res) => {
  const { id, title, price } = req.body;
  const user_id = req.session.user_id || null;

  const sql = 'INSERT INTO orders (product_id, product_title, price, user_id) VALUES (?, ?, ?, ?)';
  db.query(sql, [id, title, price, user_id], (err) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: 'Commande enregistrée !' });
  });
});


router.get('/orders', (req, res) => {
  const sql = 'SELECT * FROM orders ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

router.delete('/orders/:id', (req, res) => {
  db.query('DELETE FROM orders WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Commande supprimée' });
  });
});

router.get('/orders/search/:term', (req, res) => {
  const term = req.params.term;
  const sql = 'SELECT * FROM orders WHERE product_title LIKE ?';
  db.query(sql, [`%${term}%`], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
