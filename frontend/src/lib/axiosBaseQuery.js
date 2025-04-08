import { axiosInstance } from "@/lib/axiosInstance.js";

export const axiosBaseQuery = () =>
  async (settings) => {
    let config = {
      method: settings.method || "GET",
      ...settings
    }

    if (typeof settings === "string") {
      config.url = settings;
    }

    try {
      const result = await axiosInstance.request(config);

      return { data: result.data }
    } catch (error) {
      return { error: error };
    }
  }