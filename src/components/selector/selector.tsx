import React from 'react';
import { StyleSheet, View, Text, TouchableNativeFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors } from 'styles/colors';

interface ISelector {
  placeholder?: string;
  text?: string;
  label?: string;
  labelPosition?: 'left' | 'center';
  noIcon?: boolean;
  onPress: () => void;
}

export const Selector = (props: ISelector) => {
  return (
    <View style={styles.wrapper}>
      {!!props.label && (
        <Text
          style={[
            styles.label,
            props.labelPosition === 'left' && styles.labelLeft,
            props.labelPosition === 'center' && styles.labelCenter,
          ]}
        >
          {props.label}
        </Text>
      )}
      <TouchableNativeFeedback onPress={props.onPress}>
        <View style={styles.inputWrapper}>
          <View style={styles.textWrapper}>
            <Text
              style={[styles.text, !props.text && styles.placeholder]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {props.text ||
                props.placeholder ||
                polyglot.t('components.selector.default_placeholder')}
            </Text>
          </View>
          {!props.noIcon && (
            <Ionicons
              size={30}
              name="chevron-down-outline"
              style={styles.icon}
            />
          )}
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

Selector.defaultProps = {
  labelPosition: 'left',
  noIcon: false,
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
  },
  inputWrapper: {
    height: 40,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.offWhite,
    backgroundColor: colors.white,
  },
  textWrapper: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: colors.offBlack,
  },
  placeholder: {
    color: colors.casper,
  },
  icon: {
    color: colors.casper,
  },
  label: {
    fontWeight: '500',
    fontSize: 16,
    color: colors.mortar,
    paddingBottom: 2,
  },
  labelLeft: {
    alignSelf: 'flex-start',
  },
  labelCenter: {
    alignSelf: 'center',
  },
  labelWithText: {
    fontSize: 10,
    color: colors.nobel,
    // paddingBottom: 7,
  },
});
