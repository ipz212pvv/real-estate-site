const express = require('express');
const router = express.Router();
const repository = require('../repository/advertRepository');
const authMiddleware = require('../middlewares/authMiddleware');
const ownerMiddleware = require("../middlewares/ownerMiddleware");
const { getDecodedTokenFromHeader } = require("../utils/token");
const { models } = require("../models");

/**
 * @swagger
 * /api/adverts/search:
 *   get:
 *     summary: Search adverts with optional filters
 *     description: Fetches a list of adverts that match the provided search criteria.
 *     tags:
 *       - adverts
 *     parameters:
 *       - in: query
 *         name: typeId
 *         schema:
 *           type: integer
 *         description: Filter by advert type
 *       - in: query
 *         name: floor
 *         schema:
 *           type: integer
 *         description: Filter by floor
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination (e.g. 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of adverts per page (e.g. 10)
 *       - in: query
 *         name: room
 *         schema:
 *           type: integer
 *         description: Filter by room
 *       - in: query
 *         name: propertyTypeId
 *         schema:
 *           type: integer
 *         description: Filter by advert property type
 *       - in: query
 *         name: minPriceUah
 *         schema:
 *           type: number
 *           format: float
 *         description: Мінімальна ціна в грн
 *       - in: query
 *         name: maxPriceUah
 *         schema:
 *           type: number
 *           format: float
 *         description: Максимальна ціна в грн
 *       - in: query
 *         name: minPriceUsd
 *         schema:
 *           type: number
 *           format: float
 *         description: Мінімальна ціна в доларах
 *       - in: query
 *         name: maxPriceUsd
 *         schema:
 *           type: number
 *           format: float
 *         description: Максимальна ціна в доларах
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by district
 *       - in: query
 *         name: minArea
 *         schema:
 *           type: number
 *           format: float
 *         description: Мінімальна площа
 *       - in: query
 *         name: maxArea
 *         schema:
 *           type: number
 *           format: float
 *         description: Максимальна площа
 *       - in: query
 *         name: benefits
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: Filter by benefits by their IDs (multiple IDs allowed)
 *     responses:
 *       200:
 *         description: List of filtered adverts
 *       400:
 *         description: Bad request
 */
router.get('/search', async (req, res) => {
  try {

    const adverts = await repository.getSearchedAdverts(req.query);
    res.status(200).json(adverts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


/**
 * @swagger
 * /api/adverts/user:
 *   get:
 *     summary: User adverts
 *     description: Fetches a list of user adverts
 *     tags:
 *       - adverts
 *     responses:
 *       200:
 *         description: List of user adverts
 *       400:
 *         description: Bad request
 */
router.get('/user',authMiddleware,  async (req, res) => {
  try {

    const adverts = await repository.getUserAdverts(req);
    res.status(200).json(adverts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/adverts/user/{userId}:
 *   get:
 *     summary: Retrieve all adverts for a specific user
 *     description: |
 *       Fetches a list of adverts created by the specified user.
 *       - If `page` and `limit` are not provided, all adverts for the user will be returned.
 *       - If `page` and `limit` are specified, paginated results will be returned.
 *     tags:
 *       - adverts
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination (e.g. 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of adverts per page (e.g. 10)
 *     responses:
 *       200:
 *         description: List of user's adverts
 *       400:
 *         description: Bad request
 */
router.get('/user/:userId', async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: 'userId обовʼязковий' });
    }

    const adverts = await repository.getAllAdverts(
      { userId: parseInt(req.params.userId), isHidden: false },req.query
    );

    res.status(200).json(adverts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/adverts/admin:
 *   get:
 *     summary: Retrieve all adverts
 *     description: |
 *       Fetches a list of all adverts from the database.
 *       - If `page` and `limit` are not provided, all adverts will be returned.
 *       - If `page` and `limit` are specified, paginated results will be returned.
 *     tags:
 *       - adverts
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination (e.g. 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of adverts per page (e.g. 10)
 *     responses:
 *       200:
 *         description: List of adverts
 *       400:
 *         description: Bad request
 */
router.get('/admin', async (req, res) => {
  try {
    const adverts = await repository.getAllAdverts({}, req.query);
    res.status(200).json(adverts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/adverts:
 *   get:
 *     summary: Retrieve all adverts
 *     description: |
 *       Fetches a list of all adverts from the database.
 *       - If `page` and `limit` are not provided, all adverts will be returned.
 *       - If `page` and `limit` are specified, paginated results will be returned.
 *     tags:
 *       - adverts
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination (e.g. 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of adverts per page (e.g. 10)
 *     responses:
 *       200:
 *         description: List of adverts
 *       400:
 *         description: Bad request
 */
router.get('/', async (req, res) => {
  try {
    const adverts = await repository.getAllAdverts({isHidden:false}, req.query);
    res.status(200).json(adverts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


/**
 * @swagger
 * /api/adverts/{id}:
 *   get:
 *     summary: Retrieve an advert by ID
 *     description: Fetches a single advert from the database by its ID.
 *     tags:
 *       - adverts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Advert details
 *       400:
 *         description: Bad request
 *       404:
 *         description: Advert not found
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let where = {};
    let user = null;

    try {
      const decoded = getDecodedTokenFromHeader(req);
      user = await models.User.findOne({ where: { email: decoded.email } });
    } catch (e) {
    }

    if (!user) {
      where.isHidden = false;
    }

    const advert = await repository.getAdvertById(id, where);

    if (!advert) {
      return res.status(404).json({ error: 'Оголошення не знайдено' });
    }

    if (user && advert.userId !== user.id && advert.isHidden && user.role !== 'admin') {
      return res.status(403).json({ error: 'Оголошення приховано' });
    }

    res.status(200).json(advert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/adverts:
 *   post:
 *     summary: Create a new advert
 *     description: Creates a new advert with the provided data.
 *     tags:
 *       - adverts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               typeId:
 *                 type: integer
 *                 example: 2
 *               propertyTypeId:
 *                 type: integer
 *                 example: 2
 *               price_uah:
 *                 type: number
 *                 format: float
 *                 example: 100000
 *               price_usd:
 *                 type: number
 *                 format: float
 *                 example: 2700
 *               area:
 *                 type: number
 *                 format: float
 *                 example: 75.5
 *               description:
 *                 type: string
 *                 example: "A beautiful flat with sea view."
 *               title:
 *                 type: string
 *                 example: "A beautiful flat with sea view."
 *               room:
 *                 type: integer
 *                 example: 2
 *               floor:
 *                 type: integer
 *                 example: 2
 *               lat:
 *                 type: string
 *                 example: "50.2663590"
 *               lon:
 *                 type: string
 *                 example: "28.6873140"
 *     responses:
 *       201:
 *         description: Advert created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newAdvert = await repository.createAdvert(req);
    res.status(201).json(newAdvert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/adverts/{id}:
 *   patch:
 *     summary: Update an advert by ID
 *     description: Updates the information of an advert with the specified ID.
 *     tags:
 *       - adverts
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
 *               price_uah:
 *                 type: number
 *                 format: float
 *                 example: 120000
 *               price_usd:
 *                 type: number
 *                 format: float
 *                 example: 3200
 *               area:
 *                 type: number
 *                 format: float
 *                 example: 80.0
 *               room:
 *                 type: integer
 *                 example: 2
 *               propertyTypeId:
 *                 type: integer
 *                 example: 2
 *               typeId:
 *                 type: integer
 *                 example: 2
 *               floor:
 *                 type: integer
 *                 example: 2
 *               description:
 *                 type: string
 *                 example: "Updated description of the flat."
 *               title:
 *                 type: string
 *                 example: "Updated description of the flat."
 *               isHidden:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Advert updated successfully
 *       404:
 *         description: Advert not found
 *       400:
 *         description: Bad request
 */
router.patch('/:id', authMiddleware,ownerMiddleware('advert'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAdvert = await repository.updateAdvertById(id, req.body);
    res.status(200).json(updatedAdvert);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

/**
 * @swagger
 * /api/adverts/{id}:
 *   delete:
 *     summary: Delete an advert by ID
 *     description: Deletes the advert with the specified ID.
 *     tags:
 *       - adverts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Advert deleted successfully
 *       404:
 *         description: Advert not found
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authMiddleware,ownerMiddleware('advert'),  async (req, res) => {
  try {
    const result = await repository.deleteAdvertById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

module.exports = router;
