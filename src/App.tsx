import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {PhotoProps, Photo} from './Photo'

export enum ApiStatus { Loading, Success, Error }

interface IApiData {
  status: ApiStatus,
  error: any,
  data: any,
}

export const useApi = (url: string, body = {}) => {
  const [data, setData] = useState<IApiData>({
    status: ApiStatus.Loading,
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
        console.log('DATA:', data)
        setData({
          status: ApiStatus.Success,
          error: null,
          data
        });
      })
      .catch((err: Error) => {
        setData({
          status: ApiStatus.Error,
          data: null,
          error: err
        });
      });
  }, []);
  return data;
}

function App() {
  let { status, error, data } = useApi(`https://picsum.photos/v2/list`);
  
  return (
    <div className="App">
      <div>
      {
        data && data.map((photo: PhotoProps)  => {
          return  <Photo id={photo.id} author={photo.author} width={'200px'} height={'133px'} url={photo.url} download_url={photo.download_url} />
        })
      }
      </div>

    </div>
  );
}

export default App;
