import { api } from "@/store/services/api.js";
import { provideListTagsById } from "@/utils/provideListTagsById.js";

const adverts = api.injectEndpoints({
  tagTypes: ['Adverts'],
  endpoints: (build) => ({
    getAdverts: build.query({
      query: () => '/adverts/admin',
      providesTags: (result) => provideListTagsById(result?.adverts || [], "Adverts"),
    }),
    getLastAdverts: build.query({
      query: () => '/adverts?limit=10',
      providesTags: (result) => provideListTagsById(result?.adverts || [], "Adverts"),
    }),
    getUserAdverts: build.query({
      query: () => '/adverts/user',
      providesTags: (result) => provideListTagsById(result?.adverts || [], "Adverts"),
    }),
    getUserAdvertsById: build.query({
      query: ({ id, searchParams }) => ({
        url: `/adverts/user/${id}`,
        params: searchParams,
      }) ,
      providesTags: (result) => provideListTagsById(result?.adverts || [], "Adverts"),
    }),
    getAdvertsByIds: build.query({
      async queryFn(ids, _, __, fetchWithBQ) {
        const requests = [];

        ids.forEach(id => requests.push(fetchWithBQ(`/adverts/${id}`)))

        const responses = await Promise.allSettled(requests);
        const adverts = responses.map(({ value }) => value?.data ?? null).filter(Boolean);

        return { data: adverts }
      },
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
      invalidatesTags: (_, __, { advertId }) => [{ type: 'Adverts', id: advertId }],
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
  useGetAdvertsQuery,
  useGetUserAdvertsQuery,
  useGetUserAdvertsByIdQuery,
  useGetAdvertsByIdsQuery,
  useGetAdvertByIdQuery,
  useGetLastAdvertsQuery,
  useSearchAdvertsQuery,
  useCreateAdvertMutation,
  useEditAdvertMutation,
  useDeleteAdvertMutation,
} = adverts