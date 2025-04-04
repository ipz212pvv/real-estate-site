const express = require('express');
const router = express.Router();
const repository = require('../repository/locationRepository');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /api/locations/filter:
 *   get:
 *     summary: Get all unique location values
 *     description: Returns lists of unique cities, countries, boroughs, districts, and states from the database.
 *     tags:
 *       - locations
 *     responses:
 *       200:
 *         description: List of locations
 *       400:
 *         description: Bad request
 */
router.get('/filter', async (req, res) => {
  try {
    const locations = await repository.getAllUniqueLocations();
    res.status(200).json(locations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Retrieve all locations
 *     description: Fetches a list of all locations from the database.
 *     tags:
 *       - locations
 *     responses:
 *       200:
 *         description: List of locations
 *       400:
 *         description: Bad request
 */
router.get('/', async (req, res) => {
  try {
    const locations = await repository.getAllLocations();
    res.status(200).json(locations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/locations/{id}:
 *   get:
 *     summary: Retrieve a location by ID
 *     description: Fetches a single location from the database by its ID.
 *     tags:
 *       - locations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Location details
 *       400:
 *         description: Bad request
 *       404:
 *         description: Location not found
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const location = await repository.getLocationById(id);
    res.status(200).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/locations:
 *   post:
 *     summary: Create a new location
 *     description: Creates a new location with the provided data.
 *     tags:
 *       - locations
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
 *         description: Location created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const newLocation = await repository.createLocation(req.body.lat,req.body.lon);
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/locations/{id}:
 *   patch:
 *     summary: Update a location by ID
 *     description: Updates location information with the specified ID.
 *     tags:
 *       - locations
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
 *               lat:
 *                 type: string
 *                 example: "48.8588443"
 *               lon:
 *                 type: string
 *                 example: "2.2943506"
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       404:
 *         description: Location not found
 *       400:
 *         description: Bad request
 */
router.patch('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLocation = await repository.updateLocationById(id, req.body.lat,req.body.lon);
    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/locations/{id}:
 *   delete:
 *     summary: Delete a location by ID
 *     description: Deletes the location with the specified ID.
 *     tags:
 *       - locations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *       404:
 *         description: Location not found
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const result = await repository.deleteLocationById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
