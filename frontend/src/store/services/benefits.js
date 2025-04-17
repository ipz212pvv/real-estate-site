import { api } from "@/store/services/api.js";
import { provideListTagsById } from "@/utils/provideListTagsById.js";

const benefits = api.injectEndpoints({
	tagTypes: ['Benefits'],
	endpoints: (build) => ({
		getBenefits: build.query({
			query: () => '/benefits',
			providesTags: (result) => provideListTagsById(result, "Benefits"),
		}),
	}),
})

export const {
	useGetBenefitsQuery,
} = benefits