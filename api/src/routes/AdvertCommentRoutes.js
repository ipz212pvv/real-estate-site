const express = require('express');
const router = express.Router();
const advertCommentRepository = require('../repository/advertCommentRepository');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require("../middlewares/roleMiddleware");

/**
 * @swagger
 * /api/advert-comments:
 *   get:
 *     summary: Retrieve all advert comments
 *     description: Fetches a list of all advert comments from the database.
 *     tags:
 *       - advert-comments
 *     responses:
 *       200:
 *         description: List of advert comments
 *       400:
 *         description: Bad request
 */
router.get('/',authMiddleware, roleMiddleware('admin'),async (req, res) => {
  try {
    const advertComments = await advertCommentRepository.getAllAdvertComments();
    res.status(200).json(advertComments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-comments/{id}:
 *   get:
 *     summary: Retrieve an advert comment by ID
 *     description: Fetches a specific advert comment by its ID.
 *     tags:
 *       - advert-comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Advert comment details
 *       400:
 *         description: Bad request
 *       404:
 *         description: Advert comment not found
 */
router.get('/:id', authMiddleware, roleMiddleware('admin'),async (req, res) => {
  try {
    const { id } = req.params;
    const advertComment = await advertCommentRepository.getAdvertCommentById(id);
    res.status(200).json(advertComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-comments:
 *   post:
 *     summary: Create a new advert comment
 *     description: Creates a new advert comment with the provided data.
 *     tags:
 *       - advert-comments
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
 *               parentId:
 *                 type: integer
 *                 example: null
 *               comment:
 *                 type: string
 *                 example: "This is a comment."
 *     responses:
 *       201:
 *         description: Advert comment created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newAdvertComment = await advertCommentRepository.createAdvertComment(req);
    res.status(201).json(newAdvertComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-comments/{id}:
 *   patch:
 *     summary: Update an advert comment by ID
 *     description: Updates the advert comment with the specified ID.
 *     tags:
 *       - advert-comments
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
 *               comment:
 *                 type: string
 *                 example: "Updated comment text."
 *     responses:
 *       200:
 *         description: Advert comment updated successfully
 *       404:
 *         description: Advert comment not found
 *       400:
 *         description: Bad request
 */
router.patch('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAdvertComment = await advertCommentRepository.updateAdvertCommentById(id, req.body.comment);
    res.status(200).json(updatedAdvertComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/advert-comments/{id}:
 *   delete:
 *     summary: Delete an advert comment by ID
 *     description: Deletes the advert comment with the specified ID.
 *     tags:
 *       - advert-comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Advert comment deleted successfully
 *       404:
 *         description: Advert comment not found
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const result = await advertCommentRepository.deleteAdvertCommentById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
