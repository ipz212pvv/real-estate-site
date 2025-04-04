const express = require('express');
const argon2 = require('argon2');
const repository = require('../repository');
const { generateToken } = require("../utils/token");

const router = express.Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: User login and returns a JWT token
 *     description: Authenticates a user by their email and password, and returns a JWT token upon successful login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@gmail.com"
 *               password:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Successful login, returns a JWT token and user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       400:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({ message: 'Пошта або пароль вказано невірно' });
    }

    const user = await repository.userRepository.getUserLogin({email});
    if (!user) {
      return res.status(404).json({ message: 'Пошта або пароль вказано невірно' });
    }

    if(user.isBlocked){
      return res.status(403).json({ message: 'Даний користувач заблокований' });
    }
    
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(404).json({ message: 'Пошта або пароль вказано невірно' });
    }

    const token = generateToken(user);

    res.status(200).json({ message: 'Вхід успішний',token:token });
  } catch (error) {
    res.status(400).json({ message:error });
  }
});

module.exports = router;

