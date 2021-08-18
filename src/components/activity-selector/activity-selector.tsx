import React, { FC, ReactElement } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
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
  branchType?: string;
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
  flex?: number;
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
  // console.log('props', props.branchType)
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={cardStyles.wrapper}>
        <Image
          source={props.branchType === 'basketball' ? require('assets/img/basketball.png')
          : props.branchType === 'bicycle' ? require('assets/img/bicycle.png')
          : props.branchType === 'hiking' ? require('assets/img/hiking.png')
          : props.branchType === 'frisbee' ? require('assets/img/frisbee.png')
          : props.branchType === 'jogging' ? require('assets/img/jogging.png')
          : props.branchType === 'bowling' ? require('assets/img/bowling.png')
          : props.branchType === 'table_tennis' ? require('assets/img/table_tennis.png')
          : props.branchType === 'tennis' ? require('assets/img/tennis.png')
          : props.branchType === 'volleyball' ? require('assets/img/volleyball.png')
          : props.branchType === 'badminton' ? require('assets/img/badminton.png')
          : props.branchType === 'meditation' ? require('assets/img/meditation.png')
          : props.branchType === 'roller_skate' ? require('assets/img/roller_skate.png')
          : props.branchType === 'skateboard' ? require('assets/img/skateboard.png')
        : require('assets/img/join.png')}
          style={cardStyles.icon}
        />
        <View style={cardStyles.content}>
          <ContentItem
            text={props.title || ''}
            fontSize={15}
            fontWeight="700"
          />
          <View style={cardStyles.dateTimeWrapper}>
            <ContentItem
              flex={2}
              icon="calendar-outline"
              text={props.date || ''}
            />
            <ContentItem flex={1} icon="time-outline" text={props.time || ''} />
          </View>
          <ContentItem icon="location-outline" text={props.location || ''} />
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
        !!props.flex && dynamicStyles.flex(props.flex),
      ]}
    >
      {!!props.icon && (
        <Icon
          name={props.icon}
          type="ionicon"
          iconStyle={contentItemStyles.icon}
          size={22}
        />
      )}

      <Text
        style={StyleSheet.flatten([
          contentItemStyles.text,
          dynamicStyles.fontSize(props.fontSize || 11),
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
  flex: (value: number) => ({
    flex: value,
  }),
};
const selectorStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scroll: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
});

const cardStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.casper,
  },
  icon: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
    paddingLeft: 15,
    display: 'flex',
    flexDirection: 'column',
  },
  dateTimeWrapper: {
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
