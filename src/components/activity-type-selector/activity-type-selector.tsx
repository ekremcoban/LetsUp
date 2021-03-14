import React, { FC, ReactElement, createContext, useState } from 'react';
import { Platform, View, Text, Image, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { colors } from 'styles/colors';
import { normalize } from 'globals/helpers';
import { activitySelectorImages } from 'assets/images/activity-selector';

interface IAcivityTypeSelectorProps {
  title?: string;
  children:
    | ReactElement<IActivityTypeSelectorItemProps>
    | ReactElement<IActivityTypeSelectorItemProps>[];
}
interface IActivityTypeSelectorItemProps {
  id: number;
  icon: string;
  text?: string;
  onPress: () => void;
}
interface IAcivityTypeSelectorComposition {
  Item: FC<IActivityTypeSelectorItemProps>;
}

const ActivityTypeContext = createContext<{
  selectedActivityType: number | null;
  selectActivityType: (activityTypeId: number) => void;
}>({
  selectedActivityType: null,
  selectActivityType: () => {},
});
const useActivityTypeContext = () => {
  const context = React.useContext(ActivityTypeContext);
  if (!context) {
    throw new Error(
      `ActivityTypeSelector compound components cannot be rendered outside the ActivityTypeSelector component`
    );
  }
  return context;
};

/**
 * ActivityTypeSelector component
 * Usage: <ActivityTypeSelector />
 */
const ActivityTypeSelector: FC<IAcivityTypeSelectorProps> &
  IAcivityTypeSelectorComposition = (props: IAcivityTypeSelectorProps) => {
  const [selectedActivityType, setSelectedActivityType] = useState<
    number | null
  >(null);

  return (
    <View style={selectorStyles.wrapper}>
      {!!props.title && <Text>{props.title}</Text>}
      <ScrollView horizontal>
        <ActivityTypeContext.Provider
          value={{
            selectedActivityType,
            selectActivityType: (activityTypeId: number) =>
              setSelectedActivityType(activityTypeId),
          }}
        >
          {props.children}
        </ActivityTypeContext.Provider>
      </ScrollView>
    </View>
  );
};

/**
 * Item component will be used as children of ActivityTypeSelector
 * Usage: <ActivityTypeSelector> <ActivityTypeSelector.Item /> </ActivityTypeSelector>
 */
const ActivityTypeSelectorItem: FC<IActivityTypeSelectorItemProps> = (
  props: IActivityTypeSelectorItemProps
) => {
  const { selectedActivityType, selectActivityType } = useActivityTypeContext();

  return (
    <TouchableOpacity
      onPress={() => {
        selectActivityType(props.id);
        props.onPress();
      }}
    >
      <View style={itemStyles.wrapper}>
        <View
          style={selectedActivityType === props.id && itemStyles.iconBorder}
        >
          <Image
            source={activitySelectorImages[props.icon]}
            style={[
              itemStyles.icon,
              selectedActivityType === props.id && itemStyles.iconSelected,
            ]}
          />
        </View>
        {!!props.text && (
          <Text
            style={StyleSheet.flatten([
              itemStyles.text,
              dynamicStyles.fontSize(9),
            ])}
          >
            {props.text}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

/**
 * Styles
 */
const dynamicStyles = {
  fontSize: (size: number) => ({
    fontSize: normalize(size),
  }),
};
const selectorStyles = StyleSheet.create({
  wrapper: {
    height: 100,
    zIndex: 1,
    paddingTop: 15,
    backgroundColor: colors.veryLightGrey,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

const itemStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  iconBorder: {
    borderColor: colors.armyGreen,
    borderWidth: 3,
    borderRadius: 40,
    padding: 2,
  },
  icon: {
    width: 60,
    height: 60,
  },
  iconSelected: {
    width: 50,
    height: 50,
  },
  text: {
    marginTop: 3,
    color: colors.black,
  },
});

ActivityTypeSelector.Item = ActivityTypeSelectorItem;
export { ActivityTypeSelector };
