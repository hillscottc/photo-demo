import { useState, useEffect } from "react";

export interface iFetchData {
  error: any,
  data: any,
}

export const useFetchData = (url: string) => {
  const [data, setData] = useState<iFetchData>({
    error: null,
    data: null,
  });

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setData({
          error: null,
          data
        });
      })
      .catch((err: Error) => {
        setData({
          data: null,
          error: err
        });
      });
  }, []);
  return data;
};
