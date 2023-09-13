import React, { useEffect, useState } from 'react';
import './App.css';
import {PhotoProps, Photo} from './Photo'

interface iFetchData {
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
        return response.json()
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
}

function App() {
  let { error, data } = useFetchData(`https://picsum.photos/v2/list`);
  
  return (
    <div className="App">
      <div>
      {
        data && data.map((photo: PhotoProps)  => {
          return  <Photo key={photo.id} id={photo.id} download_url={photo.download_url} />
        })
      }
      </div>
      {
        error && <div>Error: {error}</div>
      }
    </div>
  );
}

export default App;
