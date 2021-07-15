import 'reflect-metadata';

import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { buildSchema } from 'type-graphql';
import WeatherResolver from './resolvers/weatherResolver';
import { Context } from './types/context';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

async function init() {
  if (!process.env.OPEN_WEATHER_API_KEY) {
    throw new Error('Missing OPEN_WEATHER_API_KEY in ENV');
  }

  const schema = await buildSchema({
    resolvers: [WeatherResolver],
  });

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
    context: (): Context => {
      return {
        openWeatherApiKey: process.env.OPEN_WEATHER_API_KEY || '',
      };
    },
  });

  // Start the server
  const { url } = await server.listen(4000);
  console.info(`Server is running, GraphQL Playground available at ${url}`);
}

init().catch((error) => console.error(error));
