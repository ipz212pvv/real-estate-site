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