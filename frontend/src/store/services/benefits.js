import { api } from "@/store/services/api.js";
import { provideListTagsById } from "@/utils/provideListTagsById.js";

const benefits = api.injectEndpoints({
	tagTypes: ['Benefits'],
	endpoints: (build) => ({
		getBenefits: build.query({
			query: () => '/benefits',
			providesTags: (result) => provideListTagsById(result, "Benefits"),
		}),
		editBenefit: build.mutation({
			query({ benefitId, data }) {
				return {
					url: `/benefits/${benefitId}`,
					method: "PATCH",
					data,
				}
			},
			invalidatesTags: (_, __, { benefitId }) => [{ type: 'Benefits', id: benefitId }],
		}),
		deleteBenefit: build.mutation({
			query(id) {
				return {
					url: `/benefits/${id}`,
					method: "DELETE",
				}
			},
			invalidatesTags: (_, __, id) => [{ type: 'Benefits', id }],
		}),
		createBenefit: build.mutation({
			query(data) {
				return {
					url: '/benefits',
					method: "POST",
					data,
				}
			},
			invalidatesTags: [{ type: 'Benefits', id: 'LIST' }],
		}),
	}),
})

export const {
	useGetBenefitsQuery,
	useEditBenefitMutation,
	useDeleteBenefitMutation,
	useCreateBenefitMutation,
} = benefits
