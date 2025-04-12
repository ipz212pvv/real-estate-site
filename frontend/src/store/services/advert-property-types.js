import { api } from "@/store/services/api.js";
import { provideListTagsById } from "@/utils/provideListTagsById.js";

const advertPropertyTypes = api.injectEndpoints({
  tagTypes: ['AdvertPropertyTypes'],
  endpoints: (build) => ({
    getAdvertPropertyTypes: build.query({
      query: () => '/advert-property-types',
      providesTags: (result) => provideListTagsById(result, "AdvertPropertyTypes"),
    }),
  }),
})

export const { useGetAdvertPropertyTypesQuery } = advertPropertyTypes