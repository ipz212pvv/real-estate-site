import { api } from "@/store/services/api.js";
import { provideListTagsById } from "@/utils/provideListTagsById.js";

const adverts = api.injectEndpoints({
  tagTypes: ['Adverts'],
  endpoints: (build) => ({
    getLastAdverts: build.query({
      query: () => '/adverts?limit=10',
      providesTags: (result) => provideListTagsById(result?.adverts || [], "Adverts"),
    }),
    getUserAdverts: build.query({
      query: () => '/adverts/user',
      providesTags: (result) => provideListTagsById(result?.adverts || [], "Adverts"),
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
      providesTags: (result) => provideListTagsById(result?.adverts || [], "Adverts"),
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
      query({ advertId, data }) {
        return {
          url: `/adverts/${advertId}`,
          method: "PATCH",
          data,
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
  useGetLastAdvertsQuery,
  useSearchAdvertsQuery,
  useCreateAdvertMutation,
  useEditAdvertMutation,
  useDeleteAdvertMutation,
} = adverts