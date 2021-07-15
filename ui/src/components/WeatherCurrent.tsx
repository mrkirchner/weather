import { FunctionComponent, memo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { format } from 'date-fns';

import { Coordinate, Weather } from '../types/graphql';

/***********************************************
 * Graphql
 ***********************************************/

export const FIND_CURRENT_WEATHER = gql`
  query Weather($filters: FilterWeatherInput!) {
    weather(filters: $filters) {
      city {
        name
        country
        timezone
        sunrise
        sunset
      }
      temperature {
        current
        min
        max
        feelsLike
        pressure
        humidity
      }
      conditions {
        name
        description
        icon
      }
    }
  }
`;

/***********************************************
 * Component
 ***********************************************/

const WeatherCurrent: FunctionComponent<{ coordinates?: Coordinate; zipcode?: string }> = ({
  coordinates,
  zipcode,
}) => {
  const { data: { weather } = {} } = useQuery<{
    weather: Weather;
  }>(FIND_CURRENT_WEATHER, {
    variables: {
      filters: {
        zipcode: zipcode || undefined,
        coordinates: !zipcode ? coordinates : undefined,
      },
    },
    skip: !zipcode && !coordinates,
  });

  return (
    <div className="container mx-auto p-2">
      <div className="row">
        <div className="text-gray-50 text-center">
          <h5 className="text-white font-semibold text-5xl">{weather?.city?.name}</h5>
          <h5 className="text-gray-300 font-semibold text-xl pb-6">
            {weather ? format(new Date(), 'EEEE, MMMM d, yyyy') : ''}
          </h5>
          <h1 className="text-6xl flex justify-center items-center">
            {weather?.temperature?.current || '-'}°
            {weather?.conditions?.length ? <img src={weather?.conditions[0]?.icon} alt='weather-icon' /> : ''}
          </h1>
          {weather ? (
            <>
              <div className="text-white font-semibold capitalize">
                {weather?.conditions?.length ? weather?.conditions[0]?.description : ''}
              </div>
              <div className="text-white font-semibold">
                {weather?.temperature?.min}° / {weather?.temperature?.max}°
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default memo(WeatherCurrent);
