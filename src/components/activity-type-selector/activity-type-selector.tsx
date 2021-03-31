import React, { FC, ReactElement, createContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { colors } from 'styles/colors';
import { normalize } from 'globals/helpers';
import { activityImages } from 'assets/images/activities';

interface IAcivityTypeSelectorProps {
  multiple?: boolean;
  toggle?: boolean;
  children:
    | ReactElement<IActivityTypeSelectorIconItemProps>
    | ReactElement<IActivityTypeSelectorIconItemProps>[]
    | ReactElement<IActivityTypeSelectorTextItemProps>
    | ReactElement<IActivityTypeSelectorTextItemProps>[];
}
type OnItemPress = (selectedActivityTypes: number[]) => void;

interface IActivityTypeSelectorItemSharedProps {
  id: number;
  onItemPress: OnItemPress;
}
interface IActivityTypeSelectorIconItemProps
  extends IActivityTypeSelectorItemSharedProps {
  icon: string;
  text?: string;
}

interface IActivityTypeSelectorTextItemProps
  extends IActivityTypeSelectorItemSharedProps {
  text: string;
  firstItem: boolean;
  lastItem: boolean;
}
interface IAcivityTypeSelectorComposition {
  IconItem: FC<IActivityTypeSelectorIconItemProps>;
  TextItem: FC<IActivityTypeSelectorTextItemProps>;
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
 * IconItem component will be used as children of ActivityTypeSelector
 * Usage: <ActivityTypeSelector> <ActivityTypeSelector.IconItem /> </ActivityTypeSelector>
 */
const ActivityTypeSelectorIconItem: FC<IActivityTypeSelectorIconItemProps> = (
  props: IActivityTypeSelectorIconItemProps
) => {
  const {
    selectedActivityTypes,
    toggleActivityType,
  } = useActivityTypeContext();

  const isSelected =
    selectedActivityTypes.findIndex((id: number) => id === props.id) !== -1;

  const Icon = activityImages[props.icon];

  return (
    <TouchableOpacity
      onPress={() => {
        toggleActivityType(props.id, props.onItemPress);
      }}
    >
      <View style={iconItemStyles.wrapper}>
        <View style={isSelected && iconItemStyles.iconBorder}>
          <View
            style={[
              iconItemStyles.iconWrapper,
              isSelected && iconItemStyles.iconWrapperSelected,
            ]}
          >
            <Icon height="100%" width="100%" />
          </View>
        </View>
        {!!props.text && (
          <Text
            style={StyleSheet.flatten([
              iconItemStyles.text,
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
 * TextItem component will be used as children of ActivityTypeSelector
 * Usage: <ActivityTypeSelector> <ActivityTypeSelector.TextItem /> </ActivityTypeSelector>
 */
const ActivityTypeSelectorTextItem: FC<IActivityTypeSelectorTextItemProps> = (
  props: IActivityTypeSelectorTextItemProps
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
      <View
        style={[
          textItemStyles.wrapper,
          isSelected && textItemStyles.wrapperSelected,
          props.firstItem && textItemStyles.firstItem,
          props.lastItem && textItemStyles.lastItem,
        ]}
      >
        <Text
          style={StyleSheet.flatten([
            textItemStyles.text,
            isSelected && textItemStyles.textSelected,
            dynamicStyles.fontSize(11),
            dynamicStyles.fontWeight('800'),
          ])}
        >
          {props.text}
        </Text>
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
  fontWeight: (weight: FontWeight) =>
    ({
      fontWeight: weight,
    } as const),
};

const iconItemStyles = StyleSheet.create({
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

const textItemStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    marginVertical: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.casper,
    borderRadius: 6,
  },
  wrapperSelected: {
    borderColor: colors.limeGreen,
  },
  text: {
    color: colors.casper,
  },
  textSelected: {
    color: colors.limeGreen,
  },
  firstItem: {
    marginLeft: 10,
  },
  lastItem: {
    marginRight: 10,
  },
});

ActivityTypeSelector.IconItem = ActivityTypeSelectorIconItem;
ActivityTypeSelector.TextItem = ActivityTypeSelectorTextItem;
export { ActivityTypeSelector };
