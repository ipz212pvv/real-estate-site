const express = require('express');
const router = express.Router();
const advertBenefitsRepository = require('../repository/advertBenefitsRepository');
const authMiddleware = require('../middlewares/authMiddleware');
const ownerMiddleware = require("../middlewares/ownerMiddleware");

/**
 * @swagger
 * /api/advert-benefits:
 *   get:
 *     summary: Retrieve all advert benefits
 *     description: Fetches a list of all advert benefits from the database.
 *     tags:
 *       - advert-benefits
 *     responses:
 *       200:
 *         description: List of advert benefits
 *       400:
 *         description: Bad request
 */
router.get('/', async (req, res) => {
  try {
    const advertBenefits = await advertBenefitsRepository.getAllAdvertBenefits();
    res.status(200).json(advertBenefits);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-benefits/{id}:
 *   get:
 *     summary: Retrieve an advert benefit by ID
 *     description: Fetches a specific advert benefit by its ID.
 *     tags:
 *       - advert-benefits
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Advert benefit details
 *       400:
 *         description: Bad request
 *       404:
 *         description: Advert benefit not found
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const advertBenefit = await advertBenefitsRepository.getAdvertBenefitById(id);
    res.status(200).json(advertBenefit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-benefits:
 *   post:
 *     summary: Create a new advert benefit
 *     description: Creates a new advert benefit with the provided data.
 *     tags:
 *       - advert-benefits
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               advertId:
 *                 type: integer
 *                 example: 1
 *               benefitId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Advert benefit created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware,ownerMiddleware('advert'), async (req, res) => {
  try {
    const newAdvertBenefit = await advertBenefitsRepository.createAdvertBenefit(req.body);
    res.status(201).json(newAdvertBenefit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-benefits/{id}:
 *   patch:
 *     summary: Update an advert benefit by ID
 *     description: Updates the advert benefit with the specified ID.
 *     tags:
 *       - advert-benefits
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
 *               benefitId:
 *                 type: integer
 *                 example: 6
 *     responses:
 *       200:
 *         description: Advert benefit updated successfully
 *       404:
 *         description: Advert benefit not found
 *       400:
 *         description: Bad request
 */
router.patch('/:id', authMiddleware,ownerMiddleware('advertBenefits'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAdvertBenefit = await advertBenefitsRepository.updateAdvertBenefitById(id, req.body.benefitId);
    res.status(200).json(updatedAdvertBenefit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-benefits/{id}:
 *   delete:
 *     summary: Delete an advert benefit by ID
 *     description: Deletes the advert benefit with the specified ID.
 *     tags:
 *       - advert-benefits
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Advert benefit deleted successfully
 *       404:
 *         description: Advert benefit not found
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authMiddleware,ownerMiddleware('advertBenefits'), async (req, res) => {
  try {
    const result = await advertBenefitsRepository.deleteAdvertBenefitById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
