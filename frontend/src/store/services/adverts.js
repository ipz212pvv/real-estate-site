import { api } from "@/store/services/api.js";
import { provideListTagsById } from "@/utils/provideListTagsById.js";

const adverts = api.injectEndpoints({
  tagTypes: ['Adverts'],
  endpoints: (build) => ({
    getUserAdverts: build.query({
      query: () => '/adverts/user',
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
    deleteAdvert: build.mutation({
      query(id) {
        return {
          url: `/adverts/${id}`,
          method: "DELETE",
        }
      },
      invalidatesTags: [{ type: 'Adverts', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetUserAdvertsQuery,
  useCreateAdvertMutation,
  useDeleteAdvertMutation,
} = adverts