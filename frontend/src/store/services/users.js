import { api } from "@/store/services/api.js";
import { getUserData } from "@/store/slices/authSlice.js";

const users = api.injectEndpoints({
  endpoints: (build) => ({
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
  }),
})

export const {
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
  useUpdateUserDataMutation
} = users