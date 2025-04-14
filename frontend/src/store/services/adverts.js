import { api } from "@/store/services/api.js";
import { provideListTagsById } from "@/utils/provideListTagsById.js";

const adverts = api.injectEndpoints({
  tagTypes: ['Adverts'],
  endpoints: (build) => ({
    getUserAdverts: build.query({
      query: () => '/adverts/user',
      providesTags: (result) => provideListTagsById(result, "Adverts"),
    }),
    getAdvertById: build.query({
      query: (id) => `/adverts/${id}`,
      providesTags: (_, __, id) => [{ type: "Adverts", id }],
    }),
    searchAdverts: build.query({
      query: (searchParams) => ({
        url: '/adverts/search',
        params: searchParams,
      }),
      providesTags: (result) => provideListTagsById(result, "Adverts"),
    }),
    createAdvert: build.mutation({
      query(requestData) {
        return {
          url: `/adverts`,
          method: "POST",
          data: requestData,
        }
      },
      invalidatesTags: [{ type: 'Adverts', id: 'LIST' }],
    }),
    editAdvert: build.mutation({
      query(id, requestData) {
        return {
          url: `/adverts/${id}`,
          method: "PATCH",
          data: requestData,
        }
      },
      invalidatesTags: (_, __, id) => [{ type: 'Adverts', id }],
    }),
    deleteAdvert: build.mutation({
      query(id) {
        return {
          url: `/adverts/${id}`,
          method: "DELETE",
        }
      },
      invalidatesTags: (_, __, id) => [{ type: 'Adverts', id }],
    }),
  }),
})

export const {
  useGetUserAdvertsQuery,
  useGetAdvertByIdQuery,
  useSearchAdvertsQuery,
  useCreateAdvertMutation,
  useEditAdvertMutation,
  useDeleteAdvertMutation,
} = adverts