const express = require('express');
const router = express.Router();
const repository = require('../repository/advertImageRepository');
const authMiddleware = require('../middlewares/authMiddleware');
const downloadMiddleware = require("../middlewares/downloadMiddleware");
const ownerMiddleware = require("../middlewares/ownerMiddleware");

/**
 * @swagger
 * /api/advert-images:
 *   get:
 *     summary: Retrieve all advert images
 *     description: Fetches a list of all advert images from the database.
 *     tags:
 *       - advert-images
 *     responses:
 *       200:
 *         description: List of advert images
 *       400:
 *         description: Bad request
 */
router.get('/', async (req, res) => {
  try {
    const advertImages = await repository.getAllAdvertImages();
    res.status(200).json(advertImages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-images/{id}:
 *   get:
 *     summary: Retrieve an advert image by ID
 *     description: Fetches a single advert image from the database by its ID.
 *     tags:
 *       - advert-images
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Advert image details
 *       400:
 *         description: Bad request
 *       404:
 *         description: Advert image not found
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const advertImage = await repository.getAdvertImageById(id);
    res.status(200).json(advertImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-images:
 *   post:
 *     summary: Create a new advert image
 *     description: Creates a new advert image with the provided data (JSON and image).
 *     tags:
 *       - advert-images
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               advertId:
 *                 type: integer
 *                 example: 1
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Advert image created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware,
  downloadMiddleware.single('imageUrl'),ownerMiddleware('advert'),
  async (req, res) => {
  try {
    const newAdvertImage = await repository.createAdvertImage( req );
    res.status(201).json(newAdvertImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-images/{id}:
 *   patch:
 *     summary: Update an advert image by ID
 *     description: Updates the information of an advert image with the specified ID.
 *     tags:
 *       - advert-images
 *     parameters:
 *       - in: path
 *         name: id
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
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Advert image updated successfully
 *       404:
 *         description: Advert image not found
 *       400:
 *         description: Bad request
 */
router.patch('/:id',
  authMiddleware,
  downloadMiddleware.single('imageUrl'),
  ownerMiddleware('advertImage'),
  async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAdvertImage = await repository.updateAdvertImageById(id, req);
    res.status(200).json(updatedAdvertImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-images/{id}:
 *   delete:
 *     summary: Delete an advert image by ID
 *     description: Deletes the advert image with the specified ID.
 *     tags:
 *       - advert-images
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Advert image deleted successfully
 *       404:
 *         description: Advert image not found
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authMiddleware,ownerMiddleware('advertImage'),  async (req, res) => {
  try {
    const result = await repository.deleteAdvertImageById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-images/{id}/move:
 *   patch:
 *     summary: Change the position of an advert image
 *     description: Moves an advert image to a new position and updates other images accordingly.
 *     tags:
 *       - advert-images
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
 *               newPosition:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Advert image position updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Advert image not found
 */
router.patch('/:id/move', authMiddleware,ownerMiddleware('advertImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const { newPosition } = req.body;
    const parsedPosition = parseInt(newPosition, 10);
    if (isNaN(parsedPosition)) {
      return res.status(400).json({ message: 'Невірна позиція' });
    }

    const result = await repository.moveAdvertImage(id, parsedPosition);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
