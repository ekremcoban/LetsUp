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
import { Divider, ListItem } from 'react-native-elements';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import ContextApi from 'context/ContextApi';
import {
  convertLowerString,
  filteredGeoCoder,
  filteredLocation,
} from 'components/functions/common';
import DisplaySpinner from '../../components/spinner';
import messaging from '@react-native-firebase/messaging';
import RNGooglePlaces from 'react-native-google-places';
import { Selector } from '../../components/selector/selector';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import perf from '@react-native-firebase/perf';

const ageActionSheetRef = createRef<IActionSheet>();
let activityListTemp;

export const ActivityListScreen = () => {
  const { location, user, isSameCity } = useContext(ContextApi);
  const navigation = useNavigation();
  const route = useRoute();
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;
  const [spinner, setSpinner] = useState<boolean>(true);
  const [activityList, setActivityList] = useState(null);
  const [addressList, setAddressList] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  let activityId = [];
  let addressTemp = [];
  let activityTemp = [];

  useEffect(() => {
    console.log('Burda');
 
     const unsubscribe = navigation.addListener('focus', () => {
      console.log('İçerde');
      analytics().logEvent('ActivityListScreen'
      // , {
      //   id: 3745092,
      //   item: 'mens grey t-shirt',
      //   description: ['round neck', 'long sleeved'],
      //   size: 'L',
      // }
      )
     });

     preparingData(location);

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
    return () => {
      unsubscribe();
    };
  }, [navigation, isSameCity]);

  const preparingData = async (location: any) => {
    const trace = await perf().startTrace('Activity_List');
    if (user != null) {
      trace.putAttribute('user', user.email);
    }
    else {
      trace.putAttribute('user', '');
    }

    location != undefined && getFirebase(location.country_name, location.city);
    getNotifications();

    await trace.stop();
  }

  const getNotifications = () => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      navigation.navigate('Notification');
    });
  };

  const getFirebase = async (country: string, city: string) => {
    try {
      if (location != null) {
        await firestore()
          .collection('ActivityAddress')
          .where('state', '==', true)
          .where('country', '==', country)
          .where('city', '==', city)
  
          .onSnapshot((querySnapshot) => {
            // console.log('querySnapshot Address 1', querySnapshot);
            addressTemp = [];
            activityId = [];
  
            querySnapshot != null &&
              querySnapshot.docs.forEach((documentSnapshot) => {
                // Sadece bulundugu sehirdeki aktiviteleri aldik
                activityId.push(documentSnapshot.data().activityId);
                addressTemp.push(documentSnapshot.data());
              });
  
              addressTemp.forEach(item => {
              const selectedAddress = addressTemp.filter(a => a.activityId === item.activityId);
              if (selectedAddress.length === 1 && selectedAddress[0].nodeCount === 2 && selectedAddress[0].nodeNumber === 2) {
                addressTemp = addressTemp.filter(a => a.activityId !== item.activityId && a.city === city);
                activityId = activityId.filter(a => a !== item.activityId);
                console.log('2 dest', item)
              }
            })
            // addressTemp.forEach(item => {
            //   const selectedAddress = addressTemp.filter(a => a.activityId === item.activityId);
            //   if (selectedAddress.length === 1 && selectedAddress[0].nodeCount === 2 && selectedAddress[0].nodeNumber === 2) {
            //     addressTemp = addressTemp.filter(a => a.activityId !== item.activityId && a.city === city);
            //     activityId = activityId.filter(a => a !== item.activityId);
            //     console.log('2 dest', item)
            //   }
            //   console.log('-------selectedCity', selectedAddress, selectedAddress.length)
            //   if (item.nodeCount === 2 && item.nodeNumber === 1 && selectedAddress.filter(item => item.nodeNumber === 0).length === 0) {
            //     const nodeFirst = selectedAddress.filter(item => item.nodeNumber === 1)[0];
            //     console.log('-------first', nodeFirst.city, city)
            //     if (nodeFirst.city !== city) {
            //       addressTemp = addressTemp.filter(a => a.activityId !== item.activityId);
            //       activityId = activityId.filter(a => a !== item.activityId);
            //       console.log('----- 2', addressTemp);
            //     }
            //     else {
            //       console.log('----- 2.1', addressTemp);
            //     }
            //   }
            //   else if (item.nodeCount === 3 && item.nodeNumber === 3) {
            //      if (selectedAddress.length === 1 && selectedAddress[0].city !== selectedCity) {
            //       addressTemp = addressTemp.filter(a => a.activityId !== item.activityId);
            //       activityId = activityId.filter(a => a !== item.activityId);
            //       console.log('----- 3', addressTemp);
            //      }
            //      else if (selectedAddress.length === 2 && selectedAddress[0].city !== selectedCity && selectedAddress[1].city !== selectedCity) {
            //       console.log('----- item', item);
            //       addressTemp = addressTemp.filter(a => a.activityId !== item.activityId);
            //       activityId = activityId.filter(a => a !== item.activityId);
            //       console.log('----- 3.1', addressTemp);
            //      }
            //   }
            //   else if (item.nodeCount === 4 && item.nodeNumber === 4) {
            //     if (selectedAddress.length === 1 && selectedAddress[0].city !== selectedCity && selectedAddress[0].nodeCount === 4) {
            //       addressTemp = addressTemp.filter(a => a.activityId !== item.activityId);
            //       activityId = activityId.filter(a => a !== item.activityId);
            //       console.log('----- 4', addressTemp);
            //      }
            //      else  if (selectedAddress.length === 2 && selectedAddress[0].city !== selectedCity && selectedAddress[1].city !== selectedCity && selectedAddress[0].nodeCount === 4) {
            //       addressTemp = addressTemp.filter(a => a.activityId !== item.activityId);
            //       activityId = activityId.filter(a => a !== item.activityId);
            //       console.log('----- 4.1', addressTemp);
            //      }
            //      else  if (selectedAddress.length === 3 && selectedAddress[0].city !== selectedCity && selectedAddress[1].city !== selectedCity && selectedAddress[2].city !== selectedCity && selectedAddress[0].nodeCount === 4) {
            //       addressTemp = addressTemp.filter(a => a.activityId !== item.activityId);
            //       activityId = activityId.filter(a => a !== item.activityId);
            //       console.log('----- 4.2', addressTemp);
            //      }
            //   }
            //   else if (item.nodeCount === 5 && item.nodeNumber === 5) {
            //     if (selectedAddress[0].city !== selectedCity && selectedAddress[0].nodeCount === 5) {
            //       addressTemp = addressTemp.filter(a => a.activityId !== item.activityId);
            //       activityId = activityId.filter(a => a !== item.activityId);
            //       console.log('----- 5', addressTemp);
            //      }
            //   }
            // });
  
            setAddressList([...addressTemp]);
            console.log('addressTemp 1', addressTemp);
            // console.log('activityId 1', activityId);
  
            let index = 0;
            const partion = Math.ceil(activityId.length / 10);
  
            if (partion === 0) {
              setSpinner(false);
              setActivityList(null);
            }
  
            for (let i = 0; i < partion; i++) {
              let stackTen = [];
              while (index < activityId.length) {
                stackTen.push(activityId[index++]);
                if (index % 10 === 0) {
                  firestore()
                    .collection('Activities')
                    .where('id', 'in', stackTen)
                    .onSnapshot((documentSnapshot) => {
                      documentSnapshot.docs.forEach((s) => {
                        const isIt = activityTemp.filter(
                          (a) => a.id === s.data().id
                        );
  
                        if (isIt.length === 0) {
                          activityTemp.push(s.data());
                        }
                      });
  
                      setActivityList([...activityTemp]);
                      activityListTemp = [...activityTemp];
                      console.log('activityListTemp 1', activityListTemp);
                      setSpinner(false);
                    });
  
                  stackTen = [];
                } else {
                  if (index === activityId.length) {
                    // console.log(i, 'falza', stackTen);
                    firestore()
                      .collection('Activities')
                      .where('id', 'in', stackTen)
                      .onSnapshot((documentSnapshot) => {
                        documentSnapshot.docs.forEach((s) => {
                          //Aktivite var mı bakar
                          const isIt = activityTemp.filter(
                            (a) => a.id === s.data().id
                          );
  
                          if (isIt.length === 0) {
                            activityTemp.push(s.data());
                          } else {
                            activityTemp = activityTemp.filter(
                              (item) => item.id !== s.data().id
                            );
                            activityTemp.push(s.data());
                          }
                        });
  
                        setActivityList([...activityTemp]);
                        activityListTemp = [...activityTemp];
                        console.log('activityListTemp 2', activityListTemp);
                        setSpinner(false);
                      });
  
                    stackTen = [];
                  }
                }
              }
            }
          });
      }
    } catch (error) {}
    crashlytics().recordError(error);
    crashlytics().log('Activity List');
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

  const openLocationModal = async () => {
    RNGooglePlaces.openAutocompleteModal({
      country: location.country,
      type: 'cities',
    })
      .then(async (place) => {
        setSpinner(true);
        console.log('place', place);

        const result = await filteredLocation(place);
        // console.log('result', result)
        setSelectedCountry(result.country);
        setSelectedCity(result.city);
        getFirebase(result.country, result.city);

        setSpinner(false);
      })
      .catch((error) => {
        console.log(error.message);
        setSpinner(false);
      }); // error is a Javascript Error object
  };

  const updateLocation = () => {
    let latitude: any = null;
    let longitude: any = null;

    Geolocation.getCurrentPosition((info) => {
      latitude = info.coords.latitude;
      longitude = info.coords.longitude;

      setSpinner(true);

      Geocoder.from(info.coords.latitude, info.coords.longitude)
        .then(async (place) => {
          // var basic = json.results[json.results.length - 1].address_components;

          const result = await filteredGeoCoder(place);

          setSpinner(false);
          getFirebase(result.country, result.city);
          setSelectedCountry(result.country);
          setSelectedCity(result.city);
        })
        .catch((error) => {
          setSpinner(false);
          console.warn('updateLocation', error);
        });

      console.log('loc', info);
    });
  };

  // Bransa gore
  const filterActive = (selectedActivityTypes: number[]) => {
    let filteredActivityList;
    if (activityListTemp != null && selectedActivityTypes.length === 0) {
      filteredActivityList = [...activityListTemp];
    } else if (activityListTemp != null && selectedActivityTypes.length === 1) {
      filteredActivityList = activityListTemp.filter(
        (item) => item.type === activityTypes[selectedActivityTypes[0]].image
      );
    } else if (activityListTemp != null && selectedActivityTypes.length === 2) {
      filteredActivityList = activityListTemp.filter(
        (item) =>
          item.type === activityTypes[selectedActivityTypes[0]].image ||
          item.type === activityTypes[selectedActivityTypes[1]].image
      );
    } else if (activityListTemp != null && selectedActivityTypes.length === 3) {
      filteredActivityList = activityListTemp.filter(
        (item) =>
          item.type === activityTypes[selectedActivityTypes[0]].image ||
          item.type === activityTypes[selectedActivityTypes[1]].image ||
          item.type === activityTypes[selectedActivityTypes[2]].image
      );
    } else if (activityListTemp != null && selectedActivityTypes.length === 4) {
      filteredActivityList = activityListTemp.filter(
        (item) =>
          item.type === activityTypes[selectedActivityTypes[0]].image ||
          item.type === activityTypes[selectedActivityTypes[1]].image ||
          item.type === activityTypes[selectedActivityTypes[2]].image ||
          item.type === activityTypes[selectedActivityTypes[3]].image
      );
    }
    setActivityList(filteredActivityList);
  };

  const _activityTypes = activityTypes.map(
    (activityType: IActivityType, index: number) => (
      <ActivityTypeSelector.TextItem
        key={activityType.id}
        id={activityType.id}
        firstItem={false /*index === 0*/}
        lastItem={index === activityTypes.length - 1}
        text={polyglot.t(activityType.textKey)}
        onItemPress={(selectedActivityTypes: number[]) => {
          filterActive(selectedActivityTypes);
          // Alert.alert('Tipe basıldı! ' + selectedActivityTypes.join(', '));
        }}
      />
    )
  );
  // _activityTypes.unshift(
  //   <ActivityTypeSelector.TextItem
  //     key={99}
  //     id={99}
  //     firstItem={true}
  //     lastItem={false}
  //     text="Actionsheet"
  //     onItemPress={(selecteActivityTypes: number[]) => {
  //       ageActionSheetRef.current?.open();
  //     }}
  //   />
  // );

  return (
    <SafeAreaView style={styles.wrapper}>
      {spinner && <DisplaySpinner />}
      <ActivityTypeSelector multiple>{_activityTypes}</ActivityTypeSelector>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 5, marginStart: 15 }}>
          <Selector
            warning={false}
            onPress={() => openLocationModal()}
            text={
              selectedCity == null &&
              location != undefined &&
              location.city != undefined
                ? location.city
                : selectedCity
            }
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginEnd: 15,
          }}
        >
          <Icon
            size={25}
            name="location-outline"
            type="ionicon"
            onPress={() => updateLocation()}
          />
        </View>
      </View>

      <Divider style={styles.divider} />
      {activityList != null &&
        activityList != undefined &&
        activityTypes != [] && (
          <ScrollView>
            <ActivitySelector>
              {activityList != null &&
                activityList != undefined &&
                activityList
                  .filter(
                    (x) =>
                      (user != undefined &&
                        x.state &&
                        x.owner.email !== user.email &&
                        (x.gender == user.gender || x.gender == null) &&
                        ((x.minAge <= user.age && x.maxAge >= user.age) ||
                          x.minAge == null)) ||
                      (user != undefined &&
                        x.state &&
                        x.owner.email === user.email) ||
                      (user == undefined && x.state)
                  )

                  // x.state && user != undefined
                  //   ? ((x.owner.email !== user.email &&
                  //       (x.gender == user.gender || x.gender == null)) ||
                  //       x.owner.email === user.email) &&
                  //     ((x.owner.email !== user.email &&
                  //       ((x.minAge <= user.age && x.maxAge >= user.age) ||
                  //         x.minAge == null)) ||
                  //       x.owner.email === user.email)
                  //   : x.state
                  // )
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
          <Text>There is not any activity in the city now</Text>
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
