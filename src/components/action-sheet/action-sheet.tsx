import React, { ReactNode, forwardRef } from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import ReactNativeRawBottomSheet from 'react-native-raw-bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from 'components/buttons/button';
import { colors } from 'styles/colors';
import { normalize } from 'globals/helpers';

export { ReactNativeRawBottomSheet as IActionSheet };
interface IActionSheetProps {
  title: string;
  children: ReactNode;
  onSelect: () => void;
  onCancel?: () => void;
}

export const ActionSheet = forwardRef<
  ReactNativeRawBottomSheet,
  IActionSheetProps
>((props, ref) => {
  const insets = useSafeAreaInsets();

  return (
    <ReactNativeRawBottomSheet
      ref={ref}
      height={!!props.onCancel ? 420 : 360}
      customStyles={{
        container: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <SafeAreaView>
        <View
          style={[
            styles.wrapper,
            insets.bottom === 0 && styles.wrapperSafeBottom,
          ]}
        >
          <View style={[styles.contentWrapper]}>
            <View style={styles.title}>
              <Text style={[styles.titleText, dynamicStyles.fontSize(16)]}>
                {props.title}
              </Text>
            </View>

            <View style={styles.content}>{props.children}</View>

            <View style={styles.confirm}>
              <Button
                content={polyglot.t('global.confirm')}
                onPress={props.onSelect}
                theme="inline"
                buttonStyle={styles.confirmButton}
              ></Button>
            </View>
          </View>

          {!!props.onCancel && (
            <View style={styles.cancel}>
              <Button
                content={polyglot.t('global.cancel')}
                onPress={props.onCancel}
                theme="inline"
                buttonStyle={styles.cancelButton}
                labelStyle={styles.cancelButtonLabel}
              ></Button>
            </View>
          )}
        </View>
      </SafeAreaView>
    </ReactNativeRawBottomSheet>
  );
});

/**
 * Styles
 */
const dynamicStyles = {
  fontSize: (size: number) => ({
    fontSize: normalize(size),
  }),
};
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    marginHorizontal: 10,
  },
  wrapperSafeBottom: {
    marginBottom: 10,
  },
  contentWrapper: {
    backgroundColor: colors.g02,
    borderRadius: 15,
  },
  title: {
    borderBottomWidth: 1,
    borderBottomColor: colors.offWhite,
  },
  titleText: {
    paddingVertical: 15,
    color: colors.brownGrey,
    textAlign: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  confirm: {
    borderTopWidth: 1,
    borderTopColor: colors.offWhite,
  },
  confirmButton: {
    paddingVertical: 15,
  },
  cancel: {
    backgroundColor: colors.g02,
    borderRadius: 15,
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 15,
  },
  cancelButtonLabel: {
    fontWeight: '700',
    color: colors.brightRed,
  },
});
