import { api } from "@/store/services/api.js";

const advertNearbyPlaces = api.injectEndpoints({
	tagTypes: ['AdvertNearbyPlaces'],
	endpoints: (build) => ({
		addAdvertNearbyPlace: build.mutation({
			query(data) {
				return {
					url: `/advert-nearby-places`,
					method: "POST",
					data: data,
				}
			},
			invalidatesTags: (_, __, { advertId }) => [{ type: "Adverts", id: advertId }]
		}),
		deleteAdvertNearbyPlace: build.mutation({
			query({ placeId }) {
				return {
					url: `/advert-nearby-places/${placeId}`,
					method: "DELETE",
				}
			},
			invalidatesTags: (_, __, { advertId }) => [{ type: "Adverts", advertId }]
		}),
	}),
})

export const {
	useAddAdvertNearbyPlaceMutation,
	useDeleteAdvertNearbyPlaceMutation,
} = advertNearbyPlaces