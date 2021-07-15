import React, { useEffect, useState } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import WeatherCurrent from './WeatherCurrent';
import Navigation from './Navigation';
import { Coordinate } from '../types/graphql';
import WeatherForecast from './WeatherForecast';

function App() {
  const [zipcode, setZipcode] = useState<string>('');
  const [coordinates, setCoordinates] = useState<Coordinate>();

  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_API || 'http://localhost:4000',
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((geolocation) => {
      setCoordinates({
        latitude: geolocation?.coords?.latitude,
        longitude: geolocation?.coords?.longitude,
      });
    });
  }, []);

  return (
    <ApolloProvider client={client}>
      <div className="App bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 flex-1">
        <Navigation zipcode={zipcode} onChangeLocation={setZipcode} />
        <WeatherCurrent coordinates={coordinates} zipcode={zipcode} />
        <WeatherForecast coordinates={coordinates} zipcode={zipcode} />
      </div>
    </ApolloProvider>
  );
}

export default App;
