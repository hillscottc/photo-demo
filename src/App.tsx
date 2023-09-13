import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';


export enum ApiStatus {
  // API request is being made
  Loading,
  // API call was successful
  Success,
  // API call resulted in an unauthorized error even after attempting
  // a token refresh
  ErrorUnauthorized,
  // API resulted in an error
  Error,
  // The initial request failed and we are attempting to refresh an
  // access token
  RefreshingToken,
  // We have new access token and will attempt to make a request
  // again. Note: if the retry fails the status will be `Error`.
  Retrying,
}

interface IApiData {
  status: ApiStatus
  error: any,
  data: any,
}

/*
Hook for fetching data from the backend API. Returns an `IApiData`
object. See `ApiStatus` for which states need to be handled.

API calls that fail due to an unauthorized error (expired token) are
automatically retried after attempting to refresh an access token.

To do that (and avoid infinite loops) this is essentially a state
machine that supports the following ApiStatus transitions:
  Loading -> Success
  Loading -> Error
  Loading -> RefreshingToken
  RefreshingToken -> Retrying
  RefreshingToken -> Error
  RefreshingToken -> ErrorUnauthorized
  Retrying -> Success
  Retrying -> Error
  Retrying -> ErrorUnauthorized
*/
export const useApi = (url: string, body = {}) => {
  const [retryToggle, setRetryToggle] = useState(false);
  const [data, setData] = React.useState<IApiData>({
    status: ApiStatus.Loading,
    error: null,
    data: null,
  });

  React.useEffect(() => {
    if (data.status === ApiStatus.RefreshingToken) {
      // Try refreshing the access token and retrying the request
      console.log('Attempting to refresh access token')
      myRefreshTokenFn().then(() => {
        setData({
          status: ApiStatus.Retrying,
          data: null,
          error: null,
        });

        // Trigger a retry
        setRetryToggle((i: boolean) => !i);
      }).catch((err: MyRefreshTokenError) => {
        // Handle errors and set the the API status accordingly
        if (err === MyRefreshTokenError.Expired) {
          setData({
            status: ApiStatus.ErrorUnauthorized,
            data: null,
            error: err
          });
        } else {
          setData({
            status: ApiStatus.Error,
            data: null,
            error: err
          });
        }
      });
      return;
    }
;
    const authToken = myAuthTokenFn();
    const request: RequestInit = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    }

    fetch(url, request)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json()
      })
      .then((data) => {
        setData({
          status: ApiStatus.Success,
          error: null,
          data
        });
      })
      .catch((err: Error) => {
        // The only way this could happen is if something is broken
        // with the refresh token process (e.g. we get a new access
        // token, but it's invalid due to some coding error). We
        // explicitely disallow going from Retrying -> RefreshingToken
        // in order to avoid a potential infinite loop.
        if (data.status === ApiStatus.Retrying) {
          console.log('Unauthorized. Not retrying:', data.status);
          setData({
            status: ApiStatus.ErrorUnauthorized,
            data: null,
            error: err
          });
          return;
        }

        switch (err.message) {
          // Recover from an unauthorized error by triggering a token
          // refresh.
          case 'Unauthorized':
            setData({
              status: ApiStatus.RefreshingToken,
              data: null,
              error: err
            });

            // Trigger the effect again
            setRetryToggle((i: boolean) => !i);
            break;
          default:
            setData({
              status: ApiStatus.Error,
              data: null,
              error: err
            });
        }
      });
    // This dependency allows us to re-run the effect whenever this
    // value changes.
  }, [retryToggle]);

  return data;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
