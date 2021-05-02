import React, { FC } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { normalize } from 'globals/helpers';
import { colors } from 'styles/colors';

interface IButton {
  content: string;
  onPress: () => void;
  theme?: 'normal' | 'inline';
  buttonStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const Button: FC<IButton> = (props) => (
  <TouchableOpacity
    onPress={props.onPress}
    style={StyleSheet.flatten([
      styles.container,
      props.theme === 'inline' && styles.themeInlineContainer,
      props.buttonStyle,
    ])}
  >
    <Text
      style={StyleSheet.flatten([
        styles.text,
        dynamicStyles.fontSize(16),
        props.theme === 'inline' && styles.themeInlineText,
        props.labelStyle,
      ])}
    >
      {props.content}
    </Text>
  </TouchableOpacity>
);

Button.defaultProps = {
  theme: 'normal',
};

/**
 * Styles
 */
const dynamicStyles = {
  fontSize: (size: number) => ({
    fontSize: normalize(size),
  }),
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: colors.limeGreen,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  text: {
    color: colors.white,
  },
  themeInlineContainer: {
    backgroundColor: 'transparent',
  },
  themeInlineText: {
    color: colors.limeGreen,
  },
});
