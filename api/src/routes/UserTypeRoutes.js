const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const userTypeRepository = require('../repository/userTypeRepository');

/**
 * @swagger
 * /api/user-types:
 *   get:
 *     summary: Retrieve all user types
 *     description: Fetches a list of all user types from the database.
 *     tags:
 *       - userType
 *     responses:
 *       200:
 *         description: List of user types
 */
router.get('/',  async (req, res) => {
  try {
    const userTypes = await userTypeRepository.getAllUserTypes();
    res.status(200).json(userTypes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/user-types/{id}:
 *   get:
 *     summary: Retrieve a user type by ID
 *     tags:
 *       - userType
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User type details
 */
router.get('/:id',  async (req, res) => {
  try {
    const userType = await userTypeRepository.getUserTypeById(req.params.id);
    res.status(200).json(userType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/user-types:
 *   post:
 *     summary: Create a new user type
 *     tags:
 *       - userType
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Рієлтор"
 *               description:
 *                 type: string
 *                 example: "Спеціаліст, який займається купівлею та продажем нерухомості"
 *     responses:
 *       201:
 *         description: User type created successfully
 */
router.post('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const userType = await userTypeRepository.createUserType(req.body);
    res.status(201).json(userType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/user-types/{id}:
 *   patch:
 *     summary: Update a user type by ID
 *     tags:
 *       - userType
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: User type updated successfully
 */
router.patch('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const updatedUserType = await userTypeRepository.updateUserTypeById(req.params.id, req.body);
    res.status(200).json(updatedUserType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/user-types/{id}:
 *   delete:
 *     summary: Delete user type by ID
 *     tags:
 *       - userType
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User type deleted successfully
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const result = await userTypeRepository.deleteUserTypeById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
