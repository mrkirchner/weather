import { Field, Float, Int, ObjectType } from 'type-graphql';

/***********************************************
 * Interfaces
 ***********************************************/

interface OpenWeatherWeatherResponse {
  coord: { lon: number; lat: number };
  weather: { id: string; main: string; description: string; icon: string }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  id: number;
  timezone: number;
  name: string;
  cod: number;
}

interface OpenWeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
      sea_level: number;
      grnd_level: number;
      temp_kf: number;
    };
    weather: { id: string; main: string; description: string; icon: string }[];
    visibility: number;
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    clouds: {
      all: number;
    };
  }[];
  city: {
    id: string;
    name: string;
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

/***********************************************
 * Type
 ***********************************************/

@ObjectType()
class WeatherCondition {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  icon: string;
}

@ObjectType()
class WeatherTemperature {
  @Field(() => Float)
  current: number;

  @Field(() => Float)
  min: number;

  @Field(() => Float)
  max: number;

  @Field(() => Float)
  feelsLike: number;

  @Field(() => Int)
  pressure: number;

  @Field(() => Int)
  humidity: number;
}

@ObjectType()
class WeatherCity {
  @Field()
  name: string;

  @Field()
  country: string;

  @Field(() => Int)
  timezone: number;

  @Field(() => Int)
  sunrise: number;

  @Field(() => Int)
  sunset: number;
}

@ObjectType()
class Weather {
  @Field()
  city: WeatherCity;

  @Field(() => WeatherTemperature)
  temperature: WeatherTemperature;

  @Field(() => [WeatherCondition], { defaultValue: [] })
  conditions: WeatherCondition[];
}

@ObjectType()
class Forecast {
  @Field(() => WeatherTemperature)
  temperature: WeatherTemperature;

  @Field(() => [WeatherCondition], { defaultValue: [] })
  conditions: WeatherCondition[];
}

@ObjectType()
class WeatherForecast {
  @Field()
  city: WeatherCity;

  @Field(() => [Forecast])
  forecasts: Forecast[];
}

export { Weather, WeatherForecast, Forecast, OpenWeatherWeatherResponse, OpenWeatherForecastResponse };
