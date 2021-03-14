import React, { FC, ReactElement } from 'react';
import { Platform, View, Text, Image, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';

import { colors } from 'styles/colors';
import { normalize } from 'globals/helpers';

interface IAcivitySelectorProps {
  children:
    | ReactElement<IActivitySelectorCardProps>
    | ReactElement<IActivitySelectorCardProps>[];
}
interface IActivitySelectorCardProps {
  icon?: string;
  title?: string;
  location?: string;
  date?: string;
  time?: string;
  onPress?: () => void;
}
interface IContentItemProps {
  fontSize?: number;
  fontWeight?: FontWeight;
  icon?: string;
  iconPosition?: 'left' | 'right';
  text: string;
}
interface IAcivitySelectorComposition {
  Card: React.FC<IActivitySelectorCardProps>;
}

/**
 * ActivitySelector component
 * Usage: <ActivitySelector />
 */
const ActivitySelector: FC<IAcivitySelectorProps> &
  IAcivitySelectorComposition = (props: IAcivitySelectorProps) => {
  return (
    <View style={selectorStyles.wrapper}>
      <ScrollView contentContainerStyle={selectorStyles.scroll}>
        {props.children}
      </ScrollView>
    </View>
  );
};

/**
 * Card component will be used as children of ActivitySelector
 * Usage: <ActivitySelector> <ActivitySelector.Card /> </ActivitySelector>
 */
const ActivitySelectorCard: FC<IActivitySelectorCardProps> = (
  props: IActivitySelectorCardProps
) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={cardStyles.wrapper}>
        <Image
          source={require('assets/img/hiking.png')}
          style={cardStyles.icon}
        />
        <View style={cardStyles.content}>
          <ContentItem
            text={props.title || ''}
            fontSize={15}
            fontWeight="700"
          />
          <ContentItem icon="calendar-outline" text={props.date || ''} />
          <View style={cardStyles.locationTimeWrapper}>
            <ContentItem icon="location-outline" text={props.location || ''} />
            <ContentItem icon="time-outline" text={props.time || ''} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * ContentItem for activity card content
 */
const ContentItem: FC<IContentItemProps> = (props: IContentItemProps) => {
  return (
    <View
      style={[
        contentItemStyles.wrapper,
        !props.iconPosition || props.iconPosition === 'left'
          ? contentItemStyles.wrapperRegular
          : contentItemStyles.wrapperReverse,
      ]}
    >
      {!!props.icon && (
        <Icon name={props.icon} type="ionicon" style={contentItemStyles.icon} />
      )}

      <Text
        style={StyleSheet.flatten([
          contentItemStyles.text,
          dynamicStyles.fontSize(props.fontSize || 12),
          dynamicStyles.fontWeight(props.fontWeight || 'normal'),
        ])}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {props.text}
      </Text>
    </View>
  );
};

/**
 * Styles
 */
const dynamicStyles = {
  fontSize: (size: number) => ({
    fontSize: normalize(size),
  }),
  fontWeight: (weight: FontWeight) =>
    ({
      fontWeight: weight,
    } as const),
};
const selectorStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    flex: 1,
  },
  scroll: {
    padding: 20,
  },
});

const cardStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 20,
    backgroundColor: colors.creamWhite,

    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.46,
        shadowRadius: 5.14,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  icon: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
    paddingLeft: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  locationTimeWrapper: {
    flexDirection: 'row',
  },
});

const contentItemStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },
  wrapperRegular: {
    flexDirection: 'row',
    textAlign: 'left',
  },
  wrapperReverse: {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    flex: 1,
  },
});

ActivitySelector.Card = ActivitySelectorCard;
export { ActivitySelector };
