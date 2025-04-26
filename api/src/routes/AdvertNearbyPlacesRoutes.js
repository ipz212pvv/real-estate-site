const express = require('express');
const router = express.Router();
const advertNearbyPlacesRepository = require('../repository/advertNearbyPlacesRepository');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require("../middlewares/roleMiddleware");
const ownerMiddleware = require("../middlewares/ownerMiddleware");

/**
 * @swagger
 * /api/advert-nearby-places:
 *   get:
 *     summary: Retrieve all advert nearby places
 *     description: Fetches a list of all advert nearby places from the database.
 *     tags:
 *       - advert-nearby-places
 *     responses:
 *       200:
 *         description: List of advert nearby places
 *       400:
 *         description: Bad request
 */
router.get('/', roleMiddleware('admin'),async (req, res) => {
  try {
    const advertNearbyPlaces = await advertNearbyPlacesRepository.getAllAdvertNearbyPlaces();
    res.status(200).json(advertNearbyPlaces);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-nearby-places/{id}:
 *   get:
 *     summary: Retrieve an advert nearby place by ID
 *     description: Fetches a specific advert nearby place by its ID.
 *     tags:
 *       - advert-nearby-places
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Advert nearby place details
 *       400:
 *         description: Bad request
 *       404:
 *         description: Advert nearby place not found
 */
router.get('/:id', roleMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const advertNearbyPlace = await advertNearbyPlacesRepository.getAdvertNearbyPlaceById(id);
    res.status(200).json(advertNearbyPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-nearby-places:
 *   post:
 *     summary: Create a new advert nearby place
 *     description: Creates a new advert nearby place with the provided data.
 *     tags:
 *       - advert-nearby-places
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
 *               nearbyPlaceId:
 *                 type: integer
 *                 example: 2
 *               lat:
 *                 type: string
 *                 example: "48.8588443"
 *               lon:
 *                 type: string
 *                 example: "2.2943506"
 *     responses:
 *       201:
 *         description: Advert nearby place created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware,ownerMiddleware('advert'), async (req, res) => {
  try {
    const newAdvertNearbyPlace = await advertNearbyPlacesRepository.createAdvertNearbyPlace(req.body);
    res.status(201).json(newAdvertNearbyPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-nearby-places/{id}:
 *   patch:
 *     summary: Update an advert nearby place by ID
 *     description: Updates the advert nearby place with the specified ID.
 *     tags:
 *       - advert-nearby-places
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
 *               nearbyPlaceId:
 *                 type: integer
 *                 example: 3
 *               distance:
 *                 type: number
 *                 format: float
 *                 example: 0.7
 *               duration:
 *                 type: number
 *                 format: float
 *                 example: 15.0
 *     responses:
 *       200:
 *         description: Advert nearby place updated successfully
 *       404:
 *         description: Advert nearby place not found
 *       400:
 *         description: Bad request
 */
router.patch('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAdvertNearbyPlace = await advertNearbyPlacesRepository.updateAdvertNearbyPlaceById(id, req.body);
    res.status(200).json(updatedAdvertNearbyPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-nearby-places/{id}:
 *   delete:
 *     summary: Delete an advert nearby place by ID
 *     description: Deletes the advert nearby place with the specified ID.
 *     tags:
 *       - advert-nearby-places
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Advert nearby place deleted successfully
 *       404:
 *         description: Advert nearby place not found
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await advertNearbyPlacesRepository.deleteAdvertNearbyPlaceById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
