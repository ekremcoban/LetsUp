import React, { useState } from 'react';
import { Text, TouchableNativeFeedback, View } from 'react-native';

interface IMoreLess {
  initialExpanded: boolean;
  onPress: (isExpanded: boolean) => void;
}

export const MoreLess = (props: IMoreLess) => {
  const [isExpanded, setExpanded] = useState(props.initialExpanded);

  return (
    <TouchableNativeFeedback
      onPress={() => {
        props.onPress(!isExpanded);
        setExpanded(!isExpanded);
      }}
    >
      <View
        style={{
          flexDirection: 'row-reverse',
          margin: 15,
          // backgroundColor: 'red'
        }}
      >
        <Text
          style={{
            textDecorationLine: 'underline',
            fontWeight: 'bold',
          }}
        >
          {!!isExpanded
            ? polyglot.t('screens.create_activity.components.more_less.less')
            : polyglot.t('screens.create_activity.components.more_less.more')}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};
