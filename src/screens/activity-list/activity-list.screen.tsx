import React, {
  useReducer,
  createRef,
  useContext,
  useState,
  useRef,
} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  View,
} from 'react-native';
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
import DisplaySpinner from '../../components/spinner';
import messaging from '@react-native-firebase/messaging';

const ageActionSheetRef = createRef<IActionSheet>();

export const ActivityListScreen = () => {
  const { location } = useContext(
    ContextApi
  );
  const navigation = useNavigation();
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;
  const [spinner, setSpinner] = useState<boolean>(true);
  const [activityList, setActivityList] = useState(null);
  const [addressList, setAddressList] = useState(null);

  let activityId = [];
  let addressTemp = [];
  let activityTemp = [];

  useEffect(() => {
    getFirebase();
    getNotifications();

    // const unsubscribe = navigation.addListener('focus', () => {
    //   if (isCreateActivity) {
    //     console.log('İÇERDE');
    //     setIsCreateActivity(false);
    //     if (!isMounted) {
    //       getFirebase();
    //     }
    //   } else {
    //     console.log('DIŞARDA');
    //   }
    // });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return () => {};
  }, [navigation]);

  const getNotifications = () => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      // console.log('remote', remoteMessage);
      navigation.navigate('Notification');

      // if (activityTemp != [] && addressTemp != []) {
      //   console.log('2222', activityTemp);
      //   const selectedActivity = activityTemp.filter(
      //     (activity) => activity.id === remoteMessage.data.activityId
      //   );
      //   console.log('11', selectedActivity);
      //   const selectedAddress = addressTemp.filter(
      //     (address) => address.activityId === selectedActivity[0].id
      //   );

      //   console.log('22', selectedAddress);
      //   if (selectedActivity != [] && selectedAddress != []) {
      //     navigation.navigate('Activity Info', {
      //       activity: selectedActivity[0],
      //       getPlace: getPlace,
      //       addressList: selectedAddress,
      //       from: remoteMessage.notification.title,
      //     });
      //   }
      // }
    });
  }

  const getFirebase = () => {
    if (location != null) {
      firestore()
        .collection('ActivityAddress')
        // .where('country', '==', location.country_name)
        // .where('cityEng', '==', convertLowerString(location.city))
        .where('time', '>=', new Date().getTime())
        // .where('time', '<=', new Date().getTime() + 30 * 86400000)
        .orderBy('time')

        .onSnapshot((querySnapshot) => {
          // console.log('Total users: ', querySnapshot.size);
          addressTemp = [];

          querySnapshot.forEach((documentSnapshot) => {
            console.log(
              'Activity Address: ',
              documentSnapshot.id,
              documentSnapshot.data()
            );

            // Sadece bulundugu sehirdeki aktiviteleri aldik
            if (
              documentSnapshot.data().cityEng ===
              convertLowerString(location.city)
            ) {
              activityId.push(documentSnapshot.data().activityId);
              addressTemp.push(documentSnapshot.data());
            }
          });
          console.log('addressTemp', addressTemp);
          console.log('activityId 1', activityId);
          setAddressList([...addressTemp]);

          console.log('sayı', Math.ceil(activityId.length / 10));
          let index = 0;
          const partion = Math.ceil(activityId.length / 10);

          if (partion === 0) {
            setSpinner(false);
          }

          for (let i = 0; i < partion; i++) {
            let stackTen = [];
            while (index < activityId.length) {
              stackTen.push(activityId[index++]);
              if (index % 10 === 0) {
                console.log(i, 'gonder', stackTen);
                firestore()
                  .collection('Activities')
                  .where('id', 'in', stackTen)
                  // .where('ime', '>', 1626820440000)
                  .onSnapshot((documentSnapshot) => {
                    documentSnapshot.docs.forEach((s) => {
                      // console.log('User data: ', s.data());
                      const isIt = activityTemp.filter(
                        (a) => a.id === s.data().id
                      );

                      if (isIt.length === 0) {
                        activityTemp.push(s.data());
                      }
                    });
                    console.log('activityTemp 1', activityTemp);
                    setActivityList([...activityTemp]);
                    setSpinner(false);
                  });

                stackTen = [];
              } else {
                if (index === activityId.length) {
                  console.log(i, 'falza', stackTen);
                  firestore()
                    .collection('Activities')
                    .where('id', 'in', stackTen)
                    // .where('ime', '>', 1626820440000)
                    .onSnapshot((documentSnapshot) => {
                      documentSnapshot.docs.forEach((s) => {
                        // console.log('User data: ', s.data());
                        const isIt = activityTemp.filter(
                          (a) => a.id === s.data().id
                        );

                        if (isIt.length === 0) {
                          activityTemp.push(s.data());
                        }
                      });
                      console.log('activityTemp 2', activityTemp);
                      setActivityList([...activityTemp]);
                      setSpinner(false);
                    });

                  stackTen = [];
                }
              }
            }
          }
        })
        // .catch((e) => {
        //   setSpinner(false);
        //   setActivityList(null);
        // });
    }
  };

  const getPlace = (activity: Object) => {
    if (addressList != null) {
      const place = addressList.filter(
        (address) => address.activityId === activity.id
      )[0];

      if (place != null && place.city != null && place.district != null) {
        return place.city + ', ' + place.district;
      } else if (place != null && place.city != null) {
        return place.city;
      } else if (place != null && place.district != null) {
        return place.district;
      }
    }
  };

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
      {spinner && <DisplaySpinner />}
      <ActivityTypeSelector multiple>{_activityTypes}</ActivityTypeSelector>

      <Divider style={styles.divider} />
      {activityList != null &&
        activityList != undefined &&
        activityTypes != [] && (
          <ScrollView>
            <ActivitySelector>
              {activityList != null &&
                activityList != undefined &&
                activityList
                  .filter((x) => x.state === true)
                  .sort((a, b) => {
                    return a.startTime - b.startTime;
                  })
                  .map((activity) => (
                    <ActivitySelector.Card
                      key={activity.id}
                      title={activity.name}
                      branchType={activity.type}
                      location={getPlace(activity)}
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
                      onPress={() =>
                        navigation.navigate('Activity Info', {
                          activity: activity,
                          getPlace: getPlace,
                          addressList: addressList,
                        })
                      }
                    />
                  ))}
            </ActivitySelector>
          </ScrollView>
        )}
      {!spinner && activityList == null && (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text>There is not any activity in your city now</Text>
          <Text></Text>
          <Text>Let's create first activity</Text>
        </View>
      )}
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
