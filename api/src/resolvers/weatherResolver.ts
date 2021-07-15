import { Arg, Ctx, Field, InputType, Query, Resolver } from 'type-graphql';
import { stringify } from 'query-string';
import { format } from 'date-fns';
import axios from 'axios';

import { Context } from '../types/context';
import { Coordinate } from '../types/coordinate';
import { UnitOfMeasure } from '../types/unitOfMeasure';
import {
  Forecast,
  OpenWeatherForecastResponse,
  OpenWeatherWeatherResponse,
  Weather,
  WeatherForecast,
} from '../types/weather';

/***********************************************
 * Constants
 ***********************************************/

const weatherApiURL = 'https://api.openweathermap.org/data/2.5/weather';
const forcastApiURL = 'https://api.openweathermap.org/data/2.5/forecast';

/***********************************************
 * Input Type
 ***********************************************/

@InputType()
class FilterWeatherInput {
  @Field({ nullable: true })
  zipcode?: string;

  @Field({ nullable: true })
  coordinates?: Coordinate;

  @Field(() => UnitOfMeasure, { defaultValue: UnitOfMeasure.IMPERIAL })
  unitOfMeasure?: UnitOfMeasure;
}

/***********************************************
 * Resolver
 ***********************************************/

@Resolver(() => Weather)
class WeatherResolver {
  @Query(() => Weather, { nullable: true })
  async weather(@Ctx() { openWeatherApiKey }: Context, @Arg('filters') filters: FilterWeatherInput): Promise<Weather> {
    if (!filters?.zipcode && !filters?.coordinates) {
      throw new Error('Invalid Weather filters requires an zip or coordinates (lat and long)');
    }

    try {
      const { data } = await axios.get<OpenWeatherWeatherResponse>(
        `${weatherApiURL}?${stringify({
          appid: openWeatherApiKey,
          units: filters?.unitOfMeasure,
          zip: !filters?.coordinates ? filters?.zipcode : undefined,
          lat: filters?.coordinates?.latitude || undefined,
          lon: filters?.coordinates?.longitude || undefined,
        })}`
      );

      return data
        ? {
            city: {
              name: data?.name || '',
              country: data?.sys?.country || '',
              timezone: data?.timezone || NaN,
              sunrise: data?.sys?.sunrise || NaN,
              sunset: data?.sys?.sunset || NaN,
            },
            conditions: data?.weather?.length
              ? data?.weather?.map((weather) => {
                  return {
                    name: weather?.main,
                    description: weather?.description,
                    icon: weather?.icon ? `http://openweathermap.org/img/wn/${weather?.icon}@2x.png` : '',
                  };
                })
              : [],
            temperature: {
              current: data?.main?.temp || NaN,
              min: data?.main?.temp_min || NaN,
              max: data?.main?.temp_max || NaN,
              feelsLike: data?.main?.feels_like || NaN,
              pressure: data?.main?.pressure || NaN,
              humidity: data?.main?.humidity || NaN,
            },
          }
        : null;
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }

  @Query(() => WeatherForecast, { nullable: true })
  async forecast(
    @Ctx() { openWeatherApiKey }: Context,
    @Arg('filters') filters: FilterWeatherInput
  ): Promise<WeatherForecast> {
    if (!filters?.zipcode && !filters?.coordinates) {
      throw new Error('Invalid Weather filters requires an zip or coordinates (lat and long)');
    }

    const { data } = await axios.get<OpenWeatherForecastResponse>(
      `${forcastApiURL}?${stringify({
        appid: openWeatherApiKey,
        units: filters?.unitOfMeasure,
        zip: !filters?.coordinates ? filters?.zipcode : undefined,
        lat: filters?.coordinates?.latitude || undefined,
        lon: filters?.coordinates?.longitude || undefined,
      })}`
    );

    const currentDate = format(new Date(), 'yyyy-MM-dd');

    // Hack taking mid day Forecast
    const forecastMap = new Map<string, Forecast>();
    data?.list?.forEach((d) => {
      const [date, time] = d.dt_txt.split(' ');
      if (!forecastMap.has(date) && currentDate !== date && time == '12:00:00') {
        forecastMap.set(date, {
          temperature: {
            current: d?.main?.temp || NaN,
            min: d?.main?.temp_min || NaN,
            max: d?.main?.temp_max || NaN,
            feelsLike: d?.main?.feels_like || NaN,
            pressure: d?.main?.pressure || NaN,
            humidity: d?.main?.humidity || NaN,
          },
          conditions: d?.weather?.length
            ? d?.weather?.map((weather) => {
                return {
                  name: weather?.main,
                  description: weather?.description,
                  icon: weather?.icon ? `http://openweathermap.org/img/wn/${weather?.icon}.png` : '',
                };
              })
            : [],
        });
      }
    });

    return data
      ? {
          city: {
            name: data?.city?.name || '',
            country: data?.city?.country || '',
            timezone: data?.city?.timezone || NaN,
            sunrise: data?.city?.sunrise || NaN,
            sunset: data?.city?.sunset || NaN,
          },
          forecasts: Array.from(forecastMap.values()),
        }
      : null;
  }
}

export default WeatherResolver;
