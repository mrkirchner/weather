export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Coordinate = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};

export type FilterWeatherInput = {
  zipcode?: Maybe<Scalars['String']>;
  coordinates?: Maybe<Coordinate>;
  unitOfMeasure?: Maybe<UnitOfMeasure>;
};

export type Forecast = {
  __typename?: 'Forecast';
  temperature: WeatherTemperature;
  conditions?: Maybe<Array<WeatherCondition>>;
};

export type Query = {
  __typename?: 'Query';
  weather?: Maybe<Weather>;
  forecast?: Maybe<WeatherForecast>;
};


export type QueryWeatherArgs = {
  filters: FilterWeatherInput;
};


export type QueryForecastArgs = {
  filters: FilterWeatherInput;
};

export enum UnitOfMeasure {
  /** Temperature in Kelvin */
  Standard = 'STANDARD',
  /** Temperature in Celsius */
  Metric = 'METRIC',
  /** Temperature in Fahrenheit  */
  Imperial = 'IMPERIAL'
}

export type Weather = {
  __typename?: 'Weather';
  city: WeatherCity;
  temperature: WeatherTemperature;
  conditions?: Maybe<Array<WeatherCondition>>;
};

export type WeatherCity = {
  __typename?: 'WeatherCity';
  name: Scalars['String'];
  country: Scalars['String'];
  timezone: Scalars['Int'];
  sunrise: Scalars['Int'];
  sunset: Scalars['Int'];
};

export type WeatherCondition = {
  __typename?: 'WeatherCondition';
  name: Scalars['String'];
  description: Scalars['String'];
  icon: Scalars['String'];
};

export type WeatherForecast = {
  __typename?: 'WeatherForecast';
  city: WeatherCity;
  forecasts: Array<Forecast>;
};

export type WeatherTemperature = {
  __typename?: 'WeatherTemperature';
  current: Scalars['Float'];
  min: Scalars['Float'];
  max: Scalars['Float'];
  feelsLike: Scalars['Float'];
  pressure: Scalars['Int'];
  humidity: Scalars['Int'];
};
