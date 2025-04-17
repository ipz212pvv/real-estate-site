import { api } from "@/store/services/api.js";

const advertBenefits = api.injectEndpoints({
	tagTypes: ['AdvertBenefits'],
	endpoints: (build) => ({
		addAdvertBenefit: build.mutation({
			query(requestData) {
				return {
					url: `/advert-benefits`,
					method: "POST",
					data: requestData,
				}
			},
			invalidatesTags: (_, __, { advertId }) => [{ type: "Adverts", id: advertId }]
		}),
		deleteAdvertBenefit: build.mutation({
			query({ advertBenefitId }) {
				return {
					url: `/advert-benefits/${advertBenefitId}`,
					method: "DELETE",
				}
			},
			invalidatesTags: (_, __, { advertId }) => [{ type: "Adverts", id: advertId }]
		}),
	}),
})

export const { useAddAdvertBenefitMutation, useDeleteAdvertBenefitMutation } = advertBenefits