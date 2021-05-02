import {Platform, PixelRatio} from 'react-native';

export function normalize(size: number) {
  // based on iphone 5s's scale
  const scale = window.width / 320;
  const newSize = size * scale;

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
