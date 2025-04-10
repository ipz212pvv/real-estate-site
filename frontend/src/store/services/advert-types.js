import { api } from "@/store/services/api.js";
import { provideListTagsById } from "@/utils/provideListTagsById.js";

const advertTypes = api.injectEndpoints({
  tagTypes: ['AdvertTypes'],
  endpoints: (build) => ({
    getAdvertTypes: build.query({
      query: () => '/advert-types',
      providesTags: (result) => provideListTagsById(result, "AdvertTypes"),
    }),
  }),
})

export const { useGetAdvertTypesQuery } = advertTypes