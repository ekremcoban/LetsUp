import {Dimensions} from 'react-native';
import Polyglot from 'node-polyglot';
import merge from 'lodash/merge';

import enGB from 'globals/language/en_GB.json';

export const initilizeGlobals = () => {
  window = Dimensions.get('window');

  polyglot = new Polyglot();
  polyglot.replace(merge({}, polyglot.phrases, enGB));
};
