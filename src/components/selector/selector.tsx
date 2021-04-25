import React from 'react';
import { StyleSheet, View, Text, TouchableNativeFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors } from 'styles/colors';

interface ISelector {
  placeholder?: string;
  text?: string;
  label?: string;
  onPress: () => void;
}

export const Selector = (props: ISelector) => {
  return (
    <>
      {/* {!!props.label && <Text style={styles.label}>{props.label}</Text>} */}
      <TouchableNativeFeedback onPress={props.onPress}>
        <View style={[styles.inputWrapper, props.styleView]}>
          <View style={styles.textWrapper}>
            <Text style={[styles.label, !!props.text && styles.labelWithText]}>
              {props.label}
            </Text>
            {!!props.text && (
              <Text
                style={[styles.text]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {props.text ||
                  props.placeholder ||
                  polyglot.t('components.selector.default_placeholder')}
              </Text>
            )}
          </View>
          <Ionicons size={25} name="chevron-down-outline" style={styles.icon} />
        </View>
      </TouchableNativeFeedback>
    </>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  inputWrapper: {
    height: 50,
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
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: colors.offBlack,
  },
  icon: {
    color: colors.casper,
  },
  label: {
    fontWeight: '500',
    fontSize: 18,
    color: colors.brownGrey,
    // paddingBottom: 7,
  },
  labelWithText: {
    fontSize: 10,
    color: colors.nobel,
    // paddingBottom: 7,
  },
});
