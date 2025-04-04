const express = require('express');
const router = express.Router();
const repository = require('../repository/nearbyPlacesRepository');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /api/nearby-places:
 *   get:
 *     summary: Retrieve all nearby places
 *     description: Fetches a list of all nearby places from the database.
 *     tags:
 *       - nearbyPlaces
 *     responses:
 *       200:
 *         description: List of nearby places
 *       400:
 *         description: Bad request
 */
router.get('/', async (req, res) => {
  try {
    const nearbyPlaces = await repository.getAllNearbyPlaces();
    res.status(200).json(nearbyPlaces);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/nearby-places/{id}:
 *   get:
 *     summary: Retrieve a nearby place by ID
 *     description: Fetches a single nearby place from the database by its ID.
 *     tags:
 *       - nearbyPlaces
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nearby place details
 *       400:
 *         description: Bad request
 *       404:
 *         description: Nearby place not found
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const nearbyPlace = await repository.getNearbyPlaceById(id);
    res.status(200).json(nearbyPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/nearby-places:
 *   post:
 *     summary: Create a new nearby place
 *     description: Creates a new nearby place with the provided data.
 *     tags:
 *       - nearbyPlaces
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lat:
 *                 type: string
 *                 example: "48.8588443"
 *               lon:
 *                 type: string
 *                 example: "2.2943506"
 *     responses:
 *       201:
 *         description: Nearby place created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newNearbyPlace = await repository.createNearbyPlace(req.body);
    res.status(201).json(newNearbyPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/nearby-places/{id}:
 *   patch:
 *     summary: Update a nearby place by ID
 *     description: Updates the information of a nearby place with the specified ID.
 *     tags:
 *       - nearbyPlaces
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
 *               opening_hours:
 *                 type: string
 *                 example: "9:00 AM - 6:00 PM"
 *               website:
 *                 type: string
 *                 example: "http://updated-example.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567891"
 *               brand:
 *                 type: string
 *                 example: "Updated Brand"
 *               email:
 *                 type: string
 *                 example: "updated@example.com"
 *               name:
 *                 type: string
 *                 example: "Updated Nearby Place Name"
 *     responses:
 *       200:
 *         description: Nearby place updated successfully
 *       404:
 *         description: Nearby place not found
 *       400:
 *         description: Bad request
 */
router.patch('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNearbyPlace = await repository.updateNearbyPlaceById(id, req.body);
    res.status(200).json(updatedNearbyPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/nearby-places/{id}:
 *   delete:
 *     summary: Delete a nearby place by ID
 *     description: Deletes the nearby place with the specified ID.
 *     tags:
 *       - nearbyPlaces
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nearby place deleted successfully
 *       404:
 *         description: Nearby place not found
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const result = await repository.deleteNearbyPlaceById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
