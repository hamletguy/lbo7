const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/contact', (req, res) => {
  const { nom, email, sujet, message } = req.body;
  const sql = 'INSERT INTO messages (nom, email, sujet, message) VALUES (?, ?, ?, ?)';
  db.query(sql, [nom, email, sujet, message], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: 'Message envoyé !' });
  });
});

module.exports = router;
