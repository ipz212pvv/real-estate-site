const axios = require('axios');

class OSMDataFetcher {
    constructor() {
        this.overpassUrl = 'https://overpass-api.de/api/interpreter';
        this.nominatimUrl = 'https://nominatim.openstreetmap.org/reverse';
        this.osrmUrl = 'https://router.project-osrm.org/route/v1/walking';
    }

    async getAddressDetails(lat, lon) {
        try {
            const nominatimResponse = await axios.get(`${this.nominatimUrl}`, {
                params: {
                    format: 'json',
                    lat: lat,
                    lon: lon,
                    addressdetails: 1
                },
                headers: {
                    'User-Agent': 'NodeJS OSM Data Fetcher'
                }
            });

            const buildingDetails = await this.getBuildingDetails(lat, lon);

            return {
                ...nominatimResponse.data,
                buildingDetails
            };
        } catch (error) {
            console.error('Error fetching address details:', error.message);
            throw error;
        }
    }

    async getBuildingDetails(lat, lon) {
        const radius = 10;
        const query = `
            [out:json][timeout:25];
            (
              way(around:${radius},${lat},${lon})["building"];
              relation(around:${radius},${lat},${lon})["building"];
              way(around:${radius},${lat},${lon})["amenity"];
              relation(around:${radius},${lat},${lon})["amenity"];
            );
            out body;
            >;
            out skel qt;
        `;

        try {
            const response = await axios.post(this.overpassUrl, query, {
                headers: {
                    'Content-Type': 'text/plain',
                }
            });

            const buildingData = response.data.elements.find(element =>
                element.tags
            );

            return buildingData ? buildingData.tags : null;
        } catch (error) {
            console.error('Error fetching building details:', error.message);
            return null;
        }
    }

    async getRoute(startLat, startLon, endLat, endLon) {
        try {
            const routeResponse = await axios.get(`${this.osrmUrl}/${startLon},${startLat};${endLon},${endLat}`, {
                params: {
                    overview: 'full',
                    geometries: 'geojson'
                }
            });

            return routeResponse.data.routes[0];
        } catch (error) {
            console.error('Error fetching route:', error.message);
            throw error;
        }
    }

    static async getJsonData(lat, lon)  {
        const fetcher = new OSMDataFetcher();
        return await fetcher.getAddressDetails(lat, lon);
    }
}

module.exports = OSMDataFetcher;

