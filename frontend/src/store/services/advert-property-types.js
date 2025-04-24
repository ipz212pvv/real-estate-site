import { api } from "@/store/services/api.js";
import { provideListTagsById } from "@/utils/provideListTagsById.js";

const advertPropertyTypes = api.injectEndpoints({
  tagTypes: ['AdvertPropertyTypes'],
  endpoints: (build) => ({
    getAdvertPropertyTypes: build.query({
      query: () => '/advert-property-types',
      providesTags: (result) => provideListTagsById(result, "AdvertPropertyTypes"),
    }),
    createAdvertPropertyType: build.mutation({
      query(data) {
        return {
          url: '/advert-property-types',
          method: "POST",
          data,
        }
      },
      invalidatesTags: [{ type: 'AdvertPropertyTypes', id: 'LIST' }],
    }),
    editAdvertPropertyType: build.mutation({
      query({ propertyTypeId, data }) {
        return {
          url: `/advert-property-types/${propertyTypeId}`,
          method: "PATCH",
          data,
        }
      },
      invalidatesTags: (_, __, { propertyTypeId }) => [{ type: 'AdvertPropertyTypes', id: propertyTypeId }],
    }),
    deleteAdvertPropertyType: build.mutation({
      query(id) {
        return {
          url: `/advert-property-types/${id}`,
          method: "DELETE",
        }
      },
      invalidatesTags: (_, __, id) => [{ type: 'AdvertPropertyTypes', id }],
    }),
  }),
})

export const {
  useGetAdvertPropertyTypesQuery,
  useCreateAdvertPropertyTypeMutation,
  useEditAdvertPropertyTypeMutation,
  useDeleteAdvertPropertyTypeMutation,
} = advertPropertyTypes
