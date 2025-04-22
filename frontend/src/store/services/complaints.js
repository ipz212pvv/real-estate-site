import { api } from "@/store/services/api.js";

const complaints = api.injectEndpoints({
  tagTypes: ['Complaints'],
  endpoints: (build) => ({
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
  }),
})

export const {
  useAddComplaintMutation,
} = complaints