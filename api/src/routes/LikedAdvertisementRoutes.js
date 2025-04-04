const express = require('express');
const router = express.Router();
const likedAdvertisementRepository = require('../repository/likedAdvertisementRepository');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/liked-advertisements:
 *   get:
 *     summary: Retrieve all liked advertisements
 *     description: Fetches a list of all liked advertisements from the database.
 *     tags:
 *       - liked-advertisements
 *     responses:
 *       200:
 *         description: List of liked advertisements
 *       400:
 *         description: Bad request
 */
router.get('/', async (req, res) => {
  try {
    const likedAdvertisements = await likedAdvertisementRepository.getAllLikedAdvertisements();
    res.status(200).json(likedAdvertisements);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/liked-advertisements/{id}:
 *   get:
 *     summary: Retrieve a liked advertisement by ID
 *     description: Fetches a specific liked advertisement by its ID.
 *     tags:
 *       - liked-advertisements
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liked advertisement details
 *       400:
 *         description: Bad request
 *       404:
 *         description: Liked advertisement not found
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const likedAdvertisement = await likedAdvertisementRepository.getLikedAdvertisementById(id);
    res.status(200).json(likedAdvertisement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/liked-advertisements:
 *   post:
 *     summary: Create a new liked advertisement
 *     description: Creates a new liked advertisement with the provided data.
 *     tags:
 *       - liked-advertisements
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               advertId:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       201:
 *         description: Liked advertisement created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newLikedAdvertisement = await likedAdvertisementRepository.createLikedAdvertisement(req);
    res.status(201).json(newLikedAdvertisement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/liked-advertisements/{id}:
 *   patch:
 *     summary: Update a liked advertisement by ID
 *     description: Updates the liked advertisement with the specified ID.
 *     tags:
 *       - liked-advertisements
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
 *               advertId:
 *                 type: integer
 *                 example: 124
 *     responses:
 *       200:
 *         description: Liked advertisement updated successfully
 *       404:
 *         description: Liked advertisement not found
 *       400:
 *         description: Bad request
 */
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLikedAdvertisement = await likedAdvertisementRepository.updateLikedAdvertisementById(id, req.body.advertId);
    res.status(200).json(updatedLikedAdvertisement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/liked-advertisements/{id}:
 *   delete:
 *     summary: Delete a liked advertisement by ID
 *     description: Deletes the liked advertisement with the specified ID.
 *     tags:
 *       - liked-advertisements
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liked advertisement deleted successfully
 *       404:
 *         description: Liked advertisement not found
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await likedAdvertisementRepository.deleteLikedAdvertisementById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
