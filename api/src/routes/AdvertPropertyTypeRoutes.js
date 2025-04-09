const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const advertPropertyTypeRepository = require('../repository/advertPropertyTypeRepository');

/**
 * @swagger
 * /api/advert-property-types:
 *   get:
 *     summary: Retrieve all advert types
 *     description: Fetches a list of all advert types from the database.
 *     tags:
 *       - advertPropertyType
 *     responses:
 *       200:
 *         description: List of advert types
 */
router.get('/', async (req, res) => {
  try {
    const advertPropertyType = await advertPropertyTypeRepository.getAllAdvertPropertyTypes();
    res.status(200).json(advertPropertyType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-property-types/{id}:
 *   get:
 *     summary: Retrieve an advert type by ID
 *     tags:
 *       - advertPropertyType
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
    const advertPropertyType = await advertPropertyTypeRepository.getAdvertPropertyTypeById(req.params.id);
    res.status(200).json(advertPropertyType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-property-types:
 *   post:
 *     summary: Create a new advert type
 *     tags:
 *       - advertPropertyType
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
    const advertPropertyType = await advertPropertyTypeRepository.createAdvertPropertyType(req.body);
    res.status(201).json(advertPropertyType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-property-types/{id}:
 *   patch:
 *     summary: Update an advert type by ID
 *     tags:
 *       - advertPropertyType
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
    const updateAdvertPropertyType = await advertPropertyTypeRepository.updateAdvertPropertyTypeById(req.params.id, req.body);
    res.status(200).json(updateAdvertPropertyType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-property-types/{id}:
 *   delete:
 *     summary: Delete advert type by ID
 *     tags:
 *       - advertPropertyType
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
    const result = await advertPropertyTypeRepository.deleteAdvertPropertyTypeById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
