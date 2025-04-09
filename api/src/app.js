const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./utils/swagger');
const {
    LoginRoutes,
    UserRoutes,
    BenefitsRoutes,
    UserTypeRoutes,
    NearbyPlacesRoutes,
    AdvertRoutes,
    AdvertImageRoutes,
    ComplaintRoutes,
    LocationRoutes,
    LikedAdvertisementRoutes,
    AdvertNearbyPlacesRoutes,
    AdvertCommentRoutes,
    AdvertBenefitsRoutes,
    AdvertTypeRoutes,
    AdvertPropertyTypeRoutes
} = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost',
    credentials: true,
}));

app.use('/api/login', LoginRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/user-types', UserTypeRoutes);
app.use('/api/benefits', BenefitsRoutes);
app.use('/api/locations', LocationRoutes);
app.use('/api/nearby-places', NearbyPlacesRoutes);
app.use('/api/adverts', AdvertRoutes);
app.use('/api/advert-images', AdvertImageRoutes);
app.use('/api/complaints', ComplaintRoutes);
app.use('/api/liked-advertisements', LikedAdvertisementRoutes);
app.use('/api/advert-benefits', AdvertBenefitsRoutes);
app.use('/api/advert-nearby-places', AdvertNearbyPlacesRoutes);
app.use('/api/advert-comments', AdvertCommentRoutes);
app.use('/api/advert-types', AdvertTypeRoutes);
app.use('/api/advert-property-types', AdvertPropertyTypeRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

module.exports = app;
