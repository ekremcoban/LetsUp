import React, { useReducer } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';

import { ActivityTypeSelector } from 'components/activity-type-selector/activity-type-selector';
import { ActivitySelector } from 'components/activity-selector/activity-selector';
import {
  activityTypes,
  IActivityType,
} from 'components/activity-type-selector/models';
import { activities, IActivity } from './models';
import { colors } from 'styles/colors';

export const ActivityListScreen = ({ navigation }) => {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  const _activityTypes = activityTypes.map(
    (activityType: IActivityType, index: number) => (
      <ActivityTypeSelector.TextItem
        key={activityType.id}
        id={activityType.id}
        firstItem={index === 0}
        lastItem={index === activityTypes.length - 1}
        // icon={activityType.image}
        text={polyglot.t(activityType.textKey)}
        onItemPress={(selecteActivityTypes: number[]) => {
            Alert.alert('Tipe basıldı! ' + selecteActivityTypes.join(', '));    
        }}
      />
    )
  );
  // _activityTypes.unshift(
  //   <ActivityTypeSelector.IconItem
  //     key={100}
  //     id={100}
  //     icon="basketball"
  //     text="New Activity"
  //     onItemPress={(selecteActivityTypes: number[]) => {
  //       navigation.navigate('CreateActivity');
  //     }}
  //   />
  // );

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
            onPress={() => Alert.alert('Karta basıldı!')}
          />
        ))}
      </ActivitySelector>
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
