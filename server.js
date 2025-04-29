const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes.js');
const contactRoutes = require('./routes/contactRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const session = require('express-session');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));

app.use(express.static('public'));
app.use('/api', userRoutes);
app.use('/api', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api', orderRoutes);

app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

app.get('/admin.html', (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect('/connexion.html');
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});

