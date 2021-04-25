import { Svg } from 'react-native-svg';

export const activityImages: {
  [key: string]: Svg;
} = {
  basketball: require('./basketball.svg').default,
  bicycle: require('./bicycle.svg').default,
  hiking: require('./hiking.svg').default,
  jogging: require('./jogging.svg').default,
  tableTennis: require('./tableTennis.svg').default,
};