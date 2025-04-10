import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from "@/lib/axiosBaseQuery.js";

export const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
})