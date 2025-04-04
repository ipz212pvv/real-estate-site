const express = require('express');
const router = express.Router();
const repository = require('../repository/benefitsRepository');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /api/benefits:
 *   get:
 *     summary: Retrieve all benefits
 *     description: Fetches a list of all benefits from the database.
 *     tags:
 *       - benefits
 *     responses:
 *       200:
 *         description: List of benefits
 *       400:
 *         description: Bad request
 */
router.get('/', async (req, res) => {
  try {
    const benefits = await repository.getAllBenefits();
    res.status(200).json(benefits);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

/**
 * @swagger
 * /api/benefits/{id}:
 *   get:
 *     summary: Retrieve a benefit by ID
 *     description: Fetches a single benefit from the database by its ID.
 *     tags:
 *       - benefits
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Benefit details
 *       400:
 *         description: Bad request
 *       404:
 *         description: Benefit not found
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const benefit = await repository.getBenefitById(id);
    res.status(200).json(benefit);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

/**
 * @swagger
 * /api/benefits:
 *   post:
 *     summary: Create a new benefit
 *     description: Creates a new benefit with the provided data.
 *     tags:
 *       - benefits
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
 *       201:
 *         description: Benefit created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const newBenefit = await repository.createBenefit(req.body);
    res.status(201).json(newBenefit);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

/**
 * @swagger
 * /api/benefits/{id}:
 *   patch:
 *     summary: Update a benefit by ID
 *     description: Updates benefit information with the specified ID.
 *     tags:
 *       - benefits
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
 *         description: Benefit updated successfully
 *       404:
 *         description: Benefit not found
 *       400:
 *         description: Bad request
 */
router.patch('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBenefit = await repository.updateBenefitById(id, req.body);
    res.status(200).json(updatedBenefit);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

/**
 * @swagger
 * /api/benefits/{id}:
 *   delete:
 *     summary: Delete a benefit by ID
 *     description: Deletes the benefit with the specified ID.
 *     tags:
 *       - benefits
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Benefit deleted successfully
 *       404:
 *         description: Benefit not found
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const result = await repository.deleteBenefitById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

module.exports = router;
