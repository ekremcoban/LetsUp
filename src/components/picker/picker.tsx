import React, { FC } from 'react';
import ReactNativeWheelPicker from '@gregfrench/react-native-wheel-picker';

import { colors } from 'styles/colors';
import { normalize } from 'globals/helpers';
import { StyleSheet } from 'react-native';

interface IPicker {
  items: Array<{
    value: any;
    text: string;
  }>;
  selectedValue: any;
  onValueChange: (value: any) => void;
  fluid?: boolean;
  width?: number;
  height?: number;
  fontSize?: number;
}

export const Picker: FC<IPicker> = (props) => {
  return (
    <ReactNativeWheelPicker
      style={{
        width: !!props.fluid ? '100%' : props.width,
        height: props.height,
      }}
      lineColor={colors.black} //to set top and bottom line color (Without gradients)
      lineGradientColorFrom={colors.white} //to set top and bottom starting gradient line color
      lineGradientColorTo={colors.black} //to set top and bottom ending gradient
      selectedValue={props.selectedValue}
      itemStyle={StyleSheet.flatten([
        {
          color: colors.lightGrey,
        },
        dynamicStyles.fontSize(props.fontSize || 16),
      ])}
      onValueChange={(value) => props.onValueChange(value)}
    >
      {props.items.map((item) => (
        <ReactNativeWheelPicker.Item
          label={item.text}
          value={item.value}
          key={item.value}
        />
      ))}
    </ReactNativeWheelPicker>
  );
};

Picker.defaultProps = {
  width: 100,
  height: 220,
  fontSize: 16,
};

/**
 * Styles
 */
const dynamicStyles = {
  fontSize: (size: number) => ({
    fontSize: normalize(size),
  }),
};
