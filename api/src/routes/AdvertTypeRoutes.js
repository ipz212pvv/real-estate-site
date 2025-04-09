const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const advertTypeRepository = require('../repository/advertTypeRepository');

/**
 * @swagger
 * /api/advert-types:
 *   get:
 *     summary: Retrieve all advert types
 *     description: Fetches a list of all advert types from the database.
 *     tags:
 *       - advertType
 *     responses:
 *       200:
 *         description: List of advert types
 */
router.get('/', async (req, res) => {
  try {
    const advertTypes = await advertTypeRepository.getAllAdvertTypes();
    res.status(200).json(advertTypes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-types/{id}:
 *   get:
 *     summary: Retrieve an advert type by ID
 *     tags:
 *       - advertType
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Advert type details
 */
router.get('/:id', async (req, res) => {
  try {
    const advertType = await advertTypeRepository.getAdvertTypeById(req.params.id);
    res.status(200).json(advertType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-types:
 *   post:
 *     summary: Create a new advert type
 *     tags:
 *       - advertType
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Продаж"
 *               description:
 *                 type: string
 *                 example: "Оголошення для продажу нерухомості"
 *     responses:
 *       201:
 *         description: Advert type created successfully
 */
router.post('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const advertType = await advertTypeRepository.createAdvertType(req.body);
    res.status(201).json(advertType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-types/{id}:
 *   patch:
 *     summary: Update an advert type by ID
 *     tags:
 *       - advertType
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
 *         description: Advert type updated successfully
 */
router.patch('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const updatedAdvertType = await advertTypeRepository.updateAdvertTypeById(req.params.id, req.body);
    res.status(200).json(updatedAdvertType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-types/{id}:
 *   delete:
 *     summary: Delete advert type by ID
 *     tags:
 *       - advertType
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Advert type deleted successfully
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const result = await advertTypeRepository.deleteAdvertTypeById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
