import { api } from "@/store/services/api.js";
import { getUserData } from "@/store/slices/authSlice.js";
import { provideListTagsById } from "@/utils/provideListTagsById.js";

const users = api.injectEndpoints({
  tagTypes: ['Users'],
  endpoints: (build) => ({
    getUsers: build.query({
      query: () => `/users`,
      providesTags: (result) => provideListTagsById(result || [], "Users"),
    }),
    getUserById: build.query({
      query: (id) => `/users/${id}`,
      providesTags: (_, __, id) => [{ type: "Users", id }],
    }),
    updateUserData: build.mutation({
      async queryFn(newData, { dispatch, getState }, __, fetchBQ) {
        const userId = getState().auth.user.id;

        const { data, error } = await fetchBQ({
          url: `/users/${userId}`,
          method: "PATCH",
          data: newData,
        })

        if (error) return { error }

        await dispatch(getUserData());

        return { data }
      },
    }),
    uploadAvatar: build.mutation({
      async queryFn({ avatar }, { dispatch, getState }, _, fetchBQ) {
        const userId = getState().auth.user.id;
        const requestData = new FormData();
        requestData.append("image", avatar);

        const { data, error } = await fetchBQ({
          url: `/users/${userId}/image`,
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data"
          },
          data: requestData,
        })

        if (error) return { error }

        dispatch(getUserData());

        return { data }
      },
    }),
    deleteAvatar: build.mutation({
      async queryFn(_, { dispatch, getState }, __, fetchBQ) {
        const userId = getState().auth.user.id;

        const { data, error } = await fetchBQ({
          url: `/users/${userId}/image`,
          method: "DELETE",
        })

        if (error) return { error }

        await dispatch(getUserData());

        return { data }
      },
    }),
    editUser: build.mutation({
      query({ userId, data }) {
        return {
          url: `/users/${userId}`,
          method: "PATCH",
          data
        }
      },
      invalidatesTags: (_, __, { userId }) => [{ type: 'Users', id: userId }],
    }),
    changeUserPassword: build.mutation({
      query(data) {
        return {
          url: `/users/change-password`,
          method: "POST",
          data
        }
      },
    }),
    blockUser: build.mutation({
      query({ userId, block }) {
        const action = block ? "block" : "unblock";

        return {
          url: `/users/${userId}/${action}`,
          method: "PATCH",
        }
      },
      invalidatesTags: (_, __, { userId }) => [{ type: 'Users', id: userId }],
    }),
    deleteUser: build.mutation({
      query(id) {
        return {
          url: `/users/${id}`,
          method: "DELETE",
        }
      },
      invalidatesTags: (_, __, id) => [{ type: 'Users', id }],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
  useUpdateUserDataMutation,
  useEditUserMutation,
  useBlockUserMutation,
  useDeleteUserMutation,
  useChangeUserPasswordMutation,
} = users