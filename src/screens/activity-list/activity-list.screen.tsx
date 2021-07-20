import React, { useReducer, createRef, useContext, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import { IActionSheet } from 'components/action-sheet/action-sheet';
import firestore from '@react-native-firebase/firestore';
import { ActivityTypeSelector } from 'components/activity-type-selector/activity-type-selector';
import { ActivitySelector } from 'components/activity-selector/activity-selector';
import { AgeActionSheet } from './age-action-sheet';
import {
  activityTypes,
  IActivityType,
} from 'components/activity-type-selector/models';
import { IActivity } from './models';
import { colors } from 'styles/colors';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import ContextApi from 'context/ContextApi';
import { convertLowerString } from 'components/functions/common';

const ageActionSheetRef = createRef<IActionSheet>();

export const ActivityListScreen = () => {
  const { location } = useContext(ContextApi);
  const navigation = useNavigation();
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;
  const [ activityList, setActivityList ] = useState();
  let activityId = [];
  let activityTemp = [];

  useEffect(() => {
    // const subscriber = firestore()
    //   .collection('ActivityAddress')
    //   //  .doc('2b742bc8-3ccb-42a1-8002-00370b47d113')
    //   .onSnapshot((documentSnapshot) => {
    //     documentSnapshot.docs.map((doc) => {
    //       console.log('Address data: ', doc._data);
    //     });
    //   });
    if (location != null) {
      console.log('location', location);
      firestore()
        .collection('ActivityAddress')
        // .where('country', '==', location.country_name)
        // .where( 'cityEng', '==', convertLowerString(location.city))
        .get()
        .then((querySnapshot) => {
          console.log('Total users: ', querySnapshot.size);

          querySnapshot.forEach((documentSnapshot) => {
            // console.log('Activity Address: ', documentSnapshot.id, documentSnapshot.data());
            activityId.push(documentSnapshot.data().activityId);
          });
      
          firestore()
            .collection('Activities')
            // Filter results
            .where('id', 'in', activityId)
            .get()
            .then((querySnapshot) => {
              console.log('Total Activity: ', querySnapshot.size);

              querySnapshot.forEach((documentSnapshot) => {
                console.log('Activities: ', documentSnapshot.id, documentSnapshot.data())
                activityTemp.push(documentSnapshot.data())
              });
              console.log('activityTemp', activityTemp)
              setActivityList(activityTemp);
            });
        });
       
    }
    console.log('activityList', activityList)
    // Stop listening for updates when no longer required
    // return () => subscriber();
  }, [activityList]);

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
        {activityList != null && activityList != undefined && activityList.map(activity => (
          <ActivitySelector.Card
            key={activity.id}
            title={activity.name}
            icon={'kosu.png'}
            location={'TEST'}
            date={'TEST'}
            time={'TEST'}
            onPress={() => navigation.navigate('Activity')}
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
