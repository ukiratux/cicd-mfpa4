const express = require('express');
const app = express();
app.use(express.json());
const router = express.Router();
const authController = require('../controller/authController');
const authenticateToken = require('../middleware/authMiddleware');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/check-token', authController.checkToken);








app.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route' });
});


module.exports = router;