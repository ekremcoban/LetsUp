import React, { FC, ReactElement, createContext, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { colors } from 'styles/colors';
import { normalize } from 'globals/helpers';
import { activityImages } from 'assets/images/activities';

interface IAcivityTypeSelectorProps {
  multiple?: boolean;
  toggle?: boolean;
  children:
    | ReactElement<IActivityTypeSelectorItemProps>
    | ReactElement<IActivityTypeSelectorItemProps>[];
}
type OnItemPress = (selectedActivityTypes: number[]) => void;
interface IActivityTypeSelectorItemProps {
  id: number;
  icon: string;
  text?: string;
  onItemPress: OnItemPress;
}
interface IAcivityTypeSelectorComposition {
  Item: FC<IActivityTypeSelectorItemProps>;
}

/**
 * ActivityTypeContext and useActivityTypeContext
 * Usage: useActivityTypeContext will be used in the component like; const { selectedActivityType, selectActivityType } = useActivityTypeContext()
 */
const ActivityTypeContext = createContext<{
  selectedActivityTypes: number[];
  toggleActivityType: (toggledActivityTypeId: number, cb?: OnItemPress) => void;
}>({
  selectedActivityTypes: [],
  toggleActivityType: () => {},
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
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<number[]>(
    []
  );

  return (
    <View>
      <ScrollView horizontal>
        <ActivityTypeContext.Provider
          value={{
            selectedActivityTypes,
            toggleActivityType: (
              toggledActivityTypeId: number,
              cb?: OnItemPress
            ) => {
              const toggledActivityTypeIndex = selectedActivityTypes.findIndex(
                (id: number) => id === toggledActivityTypeId
              );
              let updatedActivityTypes: number[] = [];

              if (toggledActivityTypeIndex === -1) {
                updatedActivityTypes = props.multiple
                  ? selectedActivityTypes.concat([toggledActivityTypeId])
                  : [toggledActivityTypeId];
              } else if (
                toggledActivityTypeIndex !== -1 &&
                (props.multiple || props.toggle)
              ) {
                updatedActivityTypes = selectedActivityTypes.filter(
                  (id: number) => id !== toggledActivityTypeId
                );
              }

              !!cb && cb(updatedActivityTypes);
              setSelectedActivityTypes(updatedActivityTypes);
            },
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
  const {
    selectedActivityTypes,
    toggleActivityType,
  } = useActivityTypeContext();

  const isSelected =
    selectedActivityTypes.findIndex((id: number) => id === props.id) !== -1;

  return (
    <TouchableOpacity
      onPress={() => {
        toggleActivityType(props.id, props.onItemPress);
      }}
    >
      <View style={itemStyles.wrapper}>
        <View style={isSelected && itemStyles.iconBorder}>
          <View
            style={[
              itemStyles.iconWrapper,
              isSelected && itemStyles.iconWrapperSelected,
            ]}
          >
            <Image source={activityImages[props.icon]} />
          </View>
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

const itemStyles = StyleSheet.create({
  wrapper: {
    width: 75,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 15,
    marginHorizontal: 5,
  },
  iconBorder: {
    borderColor: colors.limeGreen,
    borderWidth: 3,
    borderRadius: 40,
    padding: 2,
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: colors.casper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperSelected: {
    width: 60,
    height: 60,
    backgroundColor: colors.limeGreen,
  },
  text: {
    marginTop: 4,
    color: colors.black,
    textAlign: 'center',
  },
});

ActivityTypeSelector.Item = ActivityTypeSelectorItem;
export { ActivityTypeSelector };
