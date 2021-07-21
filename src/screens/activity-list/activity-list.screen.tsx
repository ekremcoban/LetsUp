import React, { useReducer, createRef, useContext, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
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
  const { location, isCreateActivity, setIsCreateActivity } = useContext(ContextApi);
  const navigation = useNavigation();
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;
  const [activityList, setActivityList] = useState();
  const [addressList, setAddressList] = useState();

  useEffect(() => {
    let activityId = [];
    let addressTemp = [];
    let activityTemp = [];
    let subscriber;

    if (location != null) {
      firestore()
        .collection('ActivityAddress')
        .where('country', '==', location.country_name)
        // .where('cityEng', '==', convertLowerString(location.city))
        .get()
        .then((querySnapshot) => {
          // console.log('Total users: ', querySnapshot.size);
          addressTemp = [];

          querySnapshot.forEach((documentSnapshot) => {
            console.log('Activity Address: ', documentSnapshot.id, documentSnapshot.data());
            activityId.push(documentSnapshot.data().activityId);
            addressTemp.push(documentSnapshot.data());
          });
          console.log('addressTemp', addressTemp);
           console.log('activityId 1', activityId);
          setAddressList([...addressTemp]);

          subscriber = firestore()
            .collection('Activities')
            .where('id', 'in', activityId)
            // .where('ime', '>', 1626820440000)
            .onSnapshot((documentSnapshot) => {
              activityTemp = [];
              documentSnapshot.docs.forEach((s) => {
                // console.log('User data: ', s.data());
                activityTemp.push(s.data());
              });
              setActivityList([...activityTemp]);
            });
        });
    }

    const unsubscribe = navigation.addListener('focus', () => {
      let activityId = [];
      let addressTemp = [];
      let activityTemp = [];
      let subscriber;

      if (isCreateActivity) {
        console.log('İÇERDE')
        setIsCreateActivity(false);
        if (location != null) {
          firestore()
            .collection('ActivityAddress')
            .where('country', '==', location.country_name)
            // .where('cityEng', '==', convertLowerString(location.city))
            .get()
            .then((querySnapshot) => {
              // console.log('Total users: ', querySnapshot.size);
              addressTemp = [];
  
              querySnapshot.forEach((documentSnapshot) => {
                // console.log('Activity Address: ', documentSnapshot.id, documentSnapshot.data());
                activityId.push(documentSnapshot.data().activityId);
                addressTemp.push(documentSnapshot.data());
              });
               console.log('addressTemp', addressTemp);
              // console.log('activityId', activityId);
              setAddressList([...addressTemp]);
  
              subscriber = firestore()
                .collection('Activities')
                .where('id', 'in', activityId)
                .onSnapshot((documentSnapshot) => {
                  activityTemp = [];
                  documentSnapshot.docs.forEach((s) => {
                    console.log('User data: ', s.data());
                    activityTemp.push(s.data());
                  });
                  setActivityList([...activityTemp]);
                });
            });
        }
      }
      else {
        console.log('DIŞARDA')
      }
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return {
      unsubscribe,
      subscriber,
    };
  }, [navigation]);

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
      <ScrollView>
        <ActivitySelector>
          {activityList != null &&
            activityList != undefined &&
            activityList
              .sort((a, b) => {
                return a.startTime - b.startTime;
              })
              .map((activity) => (
                <ActivitySelector.Card
                  key={activity.id}
                  title={activity.name}
                  branchType={activity.type}
                  location={
                    addressList != null &&
                    addressList.filter(
                      (address) => address.activityId === activity.id
                    )[0] != null &&
                    addressList.filter(
                      (address) => address.activityId === activity.id
                    )[0].city +
                      ', ' +
                      addressList.filter(
                        (address) => address.activityId === activity.id
                      )[0].district
                  }
                  date={new Date(activity.startTime)
                    .toString()
                    .substring(0, 15)}
                  time={
                    (new Date(activity.startTime).getHours() < 10
                      ? '0' + new Date(activity.startTime).getHours()
                      : new Date(activity.startTime).getHours()) +
                    ':' +
                    (new Date(activity.startTime).getMinutes() < 10
                      ? '0' + new Date(activity.startTime).getMinutes()
                      : new Date(activity.startTime).getMinutes())
                  }
                  onPress={() => navigation.navigate('Activity')}
                />
              ))}
        </ActivitySelector>
      </ScrollView>
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
