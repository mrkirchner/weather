import { registerEnumType } from 'type-graphql';

/***********************************************
 * Enum
 **********************************************s*/

export enum UnitOfMeasure {
  STANDARD = 'standard',
  METRIC = 'metric',
  IMPERIAL = 'imperial',
}

registerEnumType(UnitOfMeasure, {
  name: 'UnitOfMeasure',
  valuesConfig: {
    STANDARD: {
      description: 'Temperature in Kelvin',
    },
    METRIC: {
      description: 'Temperature in Celsius',
    },
    IMPERIAL: {
      description: 'Temperature in Fahrenheit ',
    },
  },
});
