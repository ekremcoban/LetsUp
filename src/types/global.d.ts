import { ScaledSize } from 'react-native';
import Polyglot from 'node-polyglot';

declare global {
  var window: ScaledSize;

  // type colorName = keyof typeof _colors;
  // var colors: { [key in colorName]: string };

  type FontWeight =
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';

  var polyglot: {
    phrases?: any;

    extend(phrases: any, prefix?: string): void;

    t(phrase: string, options?: number | Polyglot.InterpolationOptions): string;

    replace(phrases: any): void;
  };
}
