import { api } from "@/store/services/api.js";

const userTypes = api.injectEndpoints({
  endpoints: (build) => ({
    getUserTypes: build.query({
      query: () => '/user-types',
    }),
  }),
})

export const { useGetUserTypesQuery } = userTypes