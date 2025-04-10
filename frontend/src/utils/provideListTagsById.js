export const provideListTagsById = (data, type) => {
	return data
		? [
			...data.map(({ id }) => ({ type, id })),
			{ type, id: 'LIST' },
		]
		: [{ type, id: 'LIST' }]
}