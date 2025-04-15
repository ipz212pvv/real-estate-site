import { useEffect } from "react";
import { useSearchParams as useRouterSearchParams } from "react-router";

export function useSearchParams(initialValue) {
  const [urlSearchParams, setSearchParams] = useRouterSearchParams();

  const searchParams = Object.fromEntries(urlSearchParams);

  const updateSearchParams = (key, value) => {
    setSearchParams(prevParams => {
      let searchParams = Object.fromEntries(prevParams);

      if (!(Array.isArray(value) ? value.length : value ?? true)) {
        delete searchParams[key];
      } else {
        searchParams[key] = Array.isArray(value) ? JSON.stringify(value) : value;
      }

      return searchParams
    })
  }

  const clearParams = () => setSearchParams({});

  useEffect(() => {
    if (initialValue) {
      setSearchParams(initialValue);
    }
  }, []);

  return { searchParams, updateSearchParams, setSearchParams, clearParams }
}