import { useRef } from 'react';
import { Marker } from "@maptiler/sdk";

import { formatCurrency } from "@/utils/format.js";

export function useMapMarkers() {
	const markers = useRef([]);

	const removeAllMarkers = () => {
		markers.current.forEach(marker => marker.remove());
		markers.current = [];
	}

	const createMarkers = (map, adverts, onSelect) => {
		adverts.forEach(({ id, locationForAdvert, price_usd }) => {
			const { lat, lon } = locationForAdvert;
			const coordinates = [lon, lat];
			const marker = document.createElement('div');

			marker.className = 'property-marker';
			marker.textContent = formatCurrency(price_usd);
			marker.dataset.markerId = id;

			marker.addEventListener('click', () => {
				onSelect(id, coordinates);
			});

			const markerInstance = new Marker({
				element: marker,
				anchor: "bottom",
				offset: [0, -5]
			})
				.setLngLat(coordinates)
				.addTo(map);

			markers.current.push(markerInstance);
		});
	}

	return {
		markers,
		removeAllMarkers,
		createMarkers
	};
}