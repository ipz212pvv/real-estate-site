import { useEffect } from "react";
import { useSearchParams as useRouterSearchParams } from "react-router";

export function useSearchParams(initialValue) {
  const [urlSearchParams, setSearchParams] = useRouterSearchParams();

  const searchParams = Object.fromEntries(urlSearchParams);

  const updateSearchParams = (key, value = null) => {
    setSearchParams(prevParams => {
      let searchParams = Object.fromEntries(prevParams);

      if (Array.isArray(value) ? !value.length : value === null) {
        delete searchParams[key];
      } else {
        searchParams[key] = Array.isArray(value) ? value.join(',') : value;
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