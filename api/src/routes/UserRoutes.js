const express = require('express');
const router = express.Router();
const repository = require('../repository');
const { generateToken, getDecodedTokenFromHeader } = require("../utils/token");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const downloadMiddleware = require("../middlewares/downloadMiddleware");
const checkUserMiddleware = require("../middlewares/checkUserMiddleware");

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all users
 *     description: Fetches a list of all users from the database.
 *     tags:
 *       - user
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "John"
 *                   surname:
 *                     type: string
 *                     example: "Doe"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 */
router.get('/', authMiddleware,roleMiddleware('admin'),async (req, res) => {
    try {
        const users =await repository.userRepository.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Retrieve a user by decoded.id
 *     description: Fetches a single user from the database by their decoded.id.
 *     tags:
 *       - user
 *     responses:
 *       200:
 *         description: User details
 *       400:
 *         description: Bad request
 */
router.get('/me', authMiddleware,async (req, res) => {
    try {
        const  decoded = getDecodedTokenFromHeader(req);
        const  id = decoded.id;
        const user =await repository.userRepository.getUser({ id });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     description: Fetches a single user from the database by their ID.
 *     tags:
 *       - user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to fetch.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "John"
 *                 surname:
 *                   type: string
 *                   example: "Doe"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user =await repository.userRepository.getUser({ id });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with the provided data.
 *     tags:
 *       - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John"
 *               surname:
 *                 type: string
 *                 example: "Doe"
 *               phone:
 *                 type: string
 *                 example: "+380123456789"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               userTypeId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 */
router.post('/', async (req, res) => {
    try {
        const newUser = await repository.userRepository.createUser(req.body);
        const token = generateToken(newUser);

        res.status(200).json({ message: 'Реєстрація успішна', token: token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     description: Updates user information with the specified ID.
 *     tags:
 *       - user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John"
 *               surname:
 *                 type: string
 *                 example: "Doe"
 *               phone:
 *                 type: string
 *                 example: "+380123456789"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *               userTypeId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
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
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 */
router.patch('/:id', authMiddleware,checkUserMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await repository.userRepository.updateUserById(id, req.body);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Deletes the user with the specified ID.
 *     tags:
 *       - user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Користувача успішно видалено"
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
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 */
router.delete('/:id', authMiddleware,checkUserMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await repository.userRepository.deleteUserById(id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}/block:
 *   patch:
 *     summary: Блокування користувача
 *     tags:
 *       - user
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID користувача, якого потрібно заблокувати
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Користувача успішно заблоковано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Помилка запиту
 *       404:
 *         description: Користувача не знайдено
 */
router.patch("/:id/block", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    try {
        const result = await repository.userRepository.updateUserBlockStatus(req.params.id, true);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}/unblock:
 *   patch:
 *     summary: Розблокування користувача
 *     tags:
 *       - user
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID користувача, якого потрібно розблокувати
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Користувача успішно розблоковано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Помилка запиту
 *       404:
 *         description: Користувача не знайдено
 */
router.patch("/:id/unblock", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    try {
        const result = await  repository.userRepository.updateUserBlockStatus(req.params.id, false);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     tags:
 *       - user
 *     summary: Change user password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current user password
 *               newPassword:
 *                 type: string
 *                 description: New password to set
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of new password
 *     responses:
 *       200:
 *         description: Password successfully changed
 *       400:
 *         description: Invalid password format or passwords don't match
 *       401:
 *         description: Current password is incorrect
 */
router.post('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        const result = await repository.userRepository.changeUserPassword(req,currentPassword, newPassword, confirmPassword);

        res.status(200).json({ ...result});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}/image:
 *   post:
 *     tags:
 *       - user
 *     summary: Upload user profile image
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid file or error during upload
 *       404:
 *         description: User not found
 */
router.post('/:id/image',
  authMiddleware,
  checkUserMiddleware,
  downloadMiddleware.single('image'),
  async (req, res) => {
      try {
          if (!req.file) {
              return res.status(400).json({ message: 'Файл не завантажено' });
          }

          await  repository.userRepository.uploadUserImage(req.params.id, req.file);

          res.status(200).json({
              success: true,
              message: 'Зображення успішно завантажено',
          });
      } catch (error) {
          if (error.message === 'Користувача не знайдено') {
              return res.status(404).json({ message: error.message });
          }
          res.status(400).json({ message: error.message });
      }
  }
);

/**
 * @swagger
 * /api/users/{id}/image:
 *   delete:
 *     tags:
 *       - user
 *     summary: Delete user profile image
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       400:
 *         description: Error during deletion
 *       404:
 *         description: User not found
 */
router.delete('/:id/image',
  authMiddleware,
  checkUserMiddleware,
  async (req, res) => {
      try {
          await repository.userRepository.deleteUserImage(req.params.id);
          res.status(200).json({
              success: true,
              message: 'Зображення успішно видалено',
          });
      } catch (error) {
          if (error.message === 'Користувача не знайдено') {
              return res.status(404).json({ message: error.message });
          }
          res.status(400).json({ message: error.message });
      }
  }
);

/**
 * @swagger
 * /api/users/{id}/rating:
 *   patch:
 *     tags:
 *       - user
 *     summary: Update user rating
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newRating:
 *                 type: number
 *                 format: float
 *                 description: New rating to update
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: User not found
 */
router.patch('/:id/rating', authMiddleware, checkUserMiddleware, async (req, res) => {
    try {
        const { newRating } = req.body;
        const response = await repository.userRepository.updateUserRating(req.params.id, newRating);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;