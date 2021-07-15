import { Field, InputType } from 'type-graphql';

/***********************************************
 * Input Type
 ***********************************************/

@InputType()
class Coordinate {
  @Field()
  latitude: number;

  @Field()
  longitude: number;
}

export { Coordinate };
