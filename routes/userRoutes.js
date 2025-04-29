const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/users', (req, res) => {
  const { nom, email, mdp } = req.body;
  const sql = 'INSERT INTO users (nom, email, mot_de_passe) VALUES (?, ?, ?)';
  db.query(sql, [nom, email, mdp], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: 'Utilisateur inscrit !', id: result.insertId });
  });
});

router.post('/login', (req, res) => {
  const { email, mdp } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND mot_de_passe = ?';
  db.query(sql, [email, mdp], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    res.json({ message: 'Connexion réussie', user: results[0] });
  });
});

router.post('/reset', (req, res) => {
  const { email } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Email envoyé (simulé)' });
  });
});

router.get('/users', (req, res) => {
  const sql = 'SELECT id, nom, email FROM users';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


router.get('/users/search/:nom', (req, res) => {
  const { nom } = req.params;
  const sql = 'SELECT id, nom, email FROM users WHERE nom LIKE ?';
  db.query(sql, [`%${nom}%`], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

router.delete('/users/:id', (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Utilisateur supprimé' });
  });
});

router.post('/admin-login', (req, res) => {
  const { email, mdp } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND mot_de_passe = ?';
  db.query(sql, [email, mdp], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(401).json({ message: 'Identifiants incorrects' });

    req.session.admin = true;
    res.json({ message: 'Connecté en tant qu\'admin' });
  });
});

module.exports = router;
