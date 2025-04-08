import { api } from "@/store/services/api.js";

const adverts = api.injectEndpoints({
  tagTypes: ['Adverts'],
  endpoints: (build) => ({
    getUserAdverts: build.query({
      query: () => '/adverts/user',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Adverts', id })),
              { type: 'Adverts', id: 'LIST' },
            ]
          : [{ type: 'Adverts', id: 'LIST' }],
    }),
  }),
})

export const { useGetUserAdvertsQuery } = adverts