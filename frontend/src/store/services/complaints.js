import { api } from "@/store/services/api.js";
import { provideListTagsById } from "@/utils/provideListTagsById.js";

const complaints = api.injectEndpoints({
  tagTypes: ['Complaints'],
  endpoints: (build) => ({
    getComplaints: build.query({
      query: () => '/complaints',
      providesTags: (result) => provideListTagsById(result, "Complaints"),
    }),
    addComplaint: build.mutation({
      query(data) {
        return {
          url: `/complaints`,
          method: "POST",
          data,
        }
      },
      invalidatesTags: [{ type: "Complaints", id: "LIST" }]
    }),
    deleteComplaint: build.mutation({
      query(id) {
        return {
          url: `/complaints/${id}`,
          method: "DELETE",
        }
      },
      invalidatesTags: (_, __, id) => [{ type: 'Complaints', id }],
    }),
  }),
})

export const {
  useGetComplaintsQuery,
  useAddComplaintMutation,
  useDeleteComplaintMutation,
} = complaints
