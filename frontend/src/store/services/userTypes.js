import { api } from "@/store/services/api.js";
import { provideListTagsById } from "@/utils/provideListTagsById.js";

const userTypes = api.injectEndpoints({
  tagTypes: ['UserTypes'],
  endpoints: (build) => ({
    getUserTypes: build.query({
      query: () => '/user-types',
      providesTags: (result) => provideListTagsById(result, "UserTypes"),
    }),
  }),
})

export const { useGetUserTypesQuery } = userTypes