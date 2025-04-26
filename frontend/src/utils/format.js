import { arrayToString } from "@/utils/arrayToString.js";

export function formatCurrency(number) {
	return new Intl.NumberFormat("uk-UA", {
		style: "currency",
		currency: "USD",
		currencyDisplay: "narrowSymbol",
		trailingZeroDisplay: "stripIfInteger",
	}).format(number);
}

export function formatSourceFeatures(data) {
	const features = data.map(({ id, locationForAdvert: { lat, lon } }) => ({
		id,
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: [lon, lat]
		},
	}));

	return {
		'type': 'FeatureCollection',
		'features': features
	}
}

export function formatLocation(location) {
	const {
		state,
		district,
		city,
		road,
		house_number,
	} = location

	const streetName = road?.replace(new RegExp("(вулиця )|( вулиця)", "g"), "");
	const streetDisplay = streetName ? `вул. ${streetName}` : "";

	return city
		? arrayToString([city, streetDisplay, house_number])
		: arrayToString([state, district])
}

export function formatSecondsToMinutes(seconds) {
	const minutes = Math.round((seconds % 3600) / 60);

	return minutes > 0 ? `${minutes} хв` : "менше 1 хв"
}