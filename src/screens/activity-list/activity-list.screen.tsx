import React, { useReducer, createRef } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import { IActionSheet } from 'components/action-sheet/action-sheet';

import { ActivityTypeSelector } from 'components/activity-type-selector/activity-type-selector';
import { ActivitySelector } from 'components/activity-selector/activity-selector';
import { AgeActionSheet } from './age-action-sheet';
import {
  activityTypes,
  IActivityType,
} from 'components/activity-type-selector/models';
import { activities, IActivity } from './models';
import { colors } from 'styles/colors';

const ageActionSheetRef = createRef<IActionSheet>();

export const ActivityListScreen = ({ navigation }) => {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  const _activityTypes = activityTypes.map(
    (activityType: IActivityType, index: number) => (
      <ActivityTypeSelector.TextItem
        key={activityType.id}
        id={activityType.id}
        firstItem={false /*index === 0*/}
        lastItem={index === activityTypes.length - 1}
        text={polyglot.t(activityType.textKey)}
        onItemPress={(selecteActivityTypes: number[]) => {
          Alert.alert('Tipe basıldı! ' + selecteActivityTypes.join(', '));
        }}
      />
    )
  );
  _activityTypes.unshift(
    <ActivityTypeSelector.TextItem
      key={99}
      id={99}
      firstItem={true}
      lastItem={false}
      text="Actionsheet"
      onItemPress={(selecteActivityTypes: number[]) => {
        ageActionSheetRef.current?.open();
      }}
    />
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <ActivityTypeSelector multiple>{_activityTypes}</ActivityTypeSelector>

      <Divider style={styles.divider} />

      <ActivitySelector>
        {activities.map((activity: IActivity) => (
          <ActivitySelector.Card
            key={activity.id}
            title={activity.title}
            icon={activity.image}
            location={activity.location}
            date={activity.date}
            time={activity.time}
            onPress={() => navigation.navigate('Activity Info')}
          />
        ))}
      </ActivitySelector>

      <AgeActionSheet
        ref={ageActionSheetRef}
        onSelect={([min, max]: [number, number]) => {
          // ageActionSheetRef.current?.setModalVisible(false);
          Alert.alert(min + ' - ' + max);
        }}
      />
    </SafeAreaView>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  divider: {
    backgroundColor: colors.casper,
  },
});
