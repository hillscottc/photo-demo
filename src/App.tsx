import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';


export enum ApiStatus { Loading, Success, Error }

interface IApiData {
  status: ApiStatus,
  error: any,
  data: any,
}

export const useApi = (url: string, body = {}) => {
  const [data, setData] = React.useState<IApiData>({
    status: ApiStatus.Loading,
    error: null,
    data: null,
  });

  React.useEffect(() => {
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
  });
  return data;
}

function App() {
  let { status, error, data } = useApi(`https://picsum.photos/v2/list`);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />


      </header>

<div>
{
  JSON.stringify(data)
}
</div>

    </div>
  );
}

export default App;
