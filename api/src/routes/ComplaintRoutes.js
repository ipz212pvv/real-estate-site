const express = require('express');
const router = express.Router();
const complaintRepository = require('../repository/complaintRepository');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /api/complaints:
 *   get:
 *     summary: Retrieve all complaints
 *     description: Fetches a list of all complaints from the database.
 *     tags:
 *       - complaints
 *     responses:
 *       200:
 *         description: List of complaints
 *       400:
 *         description: Bad request
 */
router.get('/', async (req, res) => {
  try {
    const complaints = await complaintRepository.getAllComplaints();
    res.status(200).json(complaints);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/complaints/{id}:
 *   get:
 *     summary: Retrieve a complaint by ID
 *     description: Fetches a single complaint from the database by its ID.
 *     tags:
 *       - complaints
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Complaint details
 *       400:
 *         description: Bad request
 *       404:
 *         description: Complaint not found
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await complaintRepository.getComplaintById(id);
    res.status(200).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/complaints:
 *   post:
 *     summary: Create a new complaint
 *     description: Creates a new complaint with the provided data.
 *     tags:
 *       - complaints
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
 *               message:
 *                 type: string
 *                 example: "The advert is misleading."
 *     responses:
 *       201:
 *         description: Complaint created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newComplaint = await complaintRepository.createComplaint(req);
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/complaints/{id}:
 *   patch:
 *     summary: Update a complaint by ID
 *     description: Updates the details of a complaint with the specified ID.
 *     tags:
 *       - complaints
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
 *               message:
 *                 type: string
 *                 example: "Resolved"
 *     responses:
 *       200:
 *         description: Complaint updated successfully
 *       404:
 *         description: Complaint not found
 *       400:
 *         description: Bad request
 */
router.patch('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedComplaint = await complaintRepository.updateComplaintById(id, req.body.message);
    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/complaints/{id}:
 *   delete:
 *     summary: Delete a complaint by ID
 *     description: Deletes a complaint with the specified ID.
 *     tags:
 *       - complaints
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Complaint deleted successfully
 *       404:
 *         description: Complaint not found
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const result = await complaintRepository.deleteComplaintById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
