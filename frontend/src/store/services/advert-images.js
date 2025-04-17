import { api } from "@/store/services/api.js";

const advertImages = api.injectEndpoints({
	tagTypes: ['AdvertImages'],
	endpoints: (build) => ({
		uploadAdvertImage: build.mutation({
			query({ advertId, image }) {
				const requestData = new FormData();
				requestData.append("advertId", advertId);
				requestData.append("imageUrl", image);

				return {
					url: `/advert-images`,
					method: "POST",
					headers: {
						"Content-Type": "multipart/form-data"
					},
					data: requestData,
				}
			},
			invalidatesTags: (_, __, id) => [{ type: "Adverts", id }]
		}),
		deleteAdvertImage: build.mutation({
			query({ imageId }) {
				return {
					url: `/advert-images/${imageId}`,
					method: "DELETE",
				}
			},
			invalidatesTags: (_, __, { advertId }) => [{ type: "Adverts", advertId }]
		}),
	}),
})

export const {
	useUploadAdvertImageMutation,
	useDeleteAdvertImageMutation,
} = advertImages