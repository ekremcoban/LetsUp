import React, { useReducer } from 'react';
import { Alert, SafeAreaView } from 'react-native';
import { ActivityTypeSelector } from 'components/activity-type-selector/activity-type-selector';
import { ActivitySelector } from 'components/activity-selector/activity-selector';

import { activities, IActivity } from './models';
import {
  activityTypes,
  IActivityType,
} from 'components/activity-type-selector/models';

export const ActivityListScreen = ({ navigation }) => {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  const _activityTypes = activityTypes.map((activityType: IActivityType) => (
    <ActivityTypeSelector.Item
      key={activityType.id}
      id={activityType.id}
      icon={activityType.image}
      text={polyglot.t(activityType.textKey)}
      onItemPress={(selecteActivityTypes: number[]) => {
        Alert.alert('Tipe basıldı! ' + selecteActivityTypes.join(', '));
      }}
    />
  ));
  _activityTypes.unshift(
    <ActivityTypeSelector.Item
      key={100}
      id={100}
      icon="basketball"
      text="New Activity"
      onItemPress={(selecteActivityTypes: number[]) => {
        navigation.navigate('CreateActivity');
      }}
    />
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      <ActivityTypeSelector multiple>{_activityTypes}</ActivityTypeSelector>

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
