import { FunctionComponent } from 'react';
import { gql, useQuery } from '@apollo/client';

import { Coordinate, WeatherForecast as Forecast } from '../types/graphql';
import { addDays, format } from 'date-fns';

/***********************************************
 * Graphql
 ***********************************************/

export const FIND_CURRENT_FORECAST = gql`
  query Forecast($filters: FilterWeatherInput!) {
    forecast(filters: $filters) {
      forecasts {
        temperature {
          current
          min
          max
        }
        conditions {
          name
          description
          icon
        }
      }
    }
  }
`;

/***********************************************
 * Component
 ***********************************************/

const WeatherForecast: FunctionComponent<{ coordinates?: Coordinate; zipcode?: string }> = ({
  coordinates,
  zipcode,
}) => {
  const { data: { forecast } = {} } = useQuery<{
    forecast: Forecast;
  }>(FIND_CURRENT_FORECAST, {
    variables: {
      filters: {
        zipcode: zipcode || undefined,
        coordinates: !zipcode ? coordinates : undefined,
      },
    },
    skip: !zipcode && !coordinates,
  });

  return (
    <div className="container mx-auto pt-8 flex justify-center px-4">
      <table className="w-full lg:w-2/3 text-white table-auto ">
        <tbody>
          {forecast?.forecasts?.map((forecast, index) => {
            const startDate = new Date();

            return (
              <tr key={index} className="border-solid border-t-2 border-b-2 border-gray-300">
                <td>{format(addDays(startDate, index + 1), 'EEEE')}</td>
                <td className="border-1 border-gray-300 border-solid">
                  {forecast?.conditions?.length ? <img src={forecast?.conditions[0]?.icon} /> : ''}
                </td>
                <td className="text-white font-semibold capitalize">
                  {forecast?.conditions?.length ? forecast?.conditions[0]?.description : ''}
                </td>
                <td className="w-16 text-right">{forecast?.temperature?.max}°</td>
                <td className="w-16 text-gray-300 text-right">{forecast?.temperature?.min}°</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherForecast;
