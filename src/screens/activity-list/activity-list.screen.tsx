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
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import ContextApi from 'context/ContextApi';
import { convertLowerString } from 'components/functions/common';
import DisplaySpinner from '../../components/spinner';
import messaging from '@react-native-firebase/messaging';
import RNGooglePlaces from 'react-native-google-places';
import { Selector } from '../../components/selector/selector';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import translate from 'translate-google-api';

const ageActionSheetRef = createRef<IActionSheet>();
let activityListTemp;

export const ActivityListScreen = () => {
  const { location, user } = useContext(ContextApi);
  const navigation = useNavigation();
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;
  const [spinner, setSpinner] = useState<boolean>(true);
  const [activityList, setActivityList] = useState(null);
  const [addressList, setAddressList] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [inCountry, setInCountry] = useState<boolean>(true);

  let activityId = [];
  let addressTemp = [];
  let activityTemp = [];

  useEffect(() => {
    location != undefined && getFirebase(location.city);
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
      navigation.navigate('Notification');
    });
  };

  const getFirebase = async (city: string) => {
    console.log('location', location);
    const countryEng = convertLowerString(location.country_name).toLowerCase();
    const cityEng = convertLowerString(city).toLowerCase();

    if (location != null) {
      await firestore()
        .collection('ActivityAddress')
        .where('state', '==', true)
        .where('countryEng', '==', countryEng)
        .where('cityEng', '==', cityEng)

        .onSnapshot((querySnapshot) => {
          // console.log('querySnapshot', querySnapshot);
          addressTemp = [];

          querySnapshot != null &&
            querySnapshot.docs.forEach((documentSnapshot) => {
              // Sadece bulundugu sehirdeki aktiviteleri aldik
              activityId.push(documentSnapshot.data().activityId);
              addressTemp.push(documentSnapshot.data());
            });
          setAddressList([...addressTemp]);
          console.log('addressTemp', addressTemp);

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
                console.log(i, 'gonder', stackTen);
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
                    setSpinner(false);
                  });

                stackTen = [];
              } else {
                if (index === activityId.length) {
                  console.log(i, 'falza', stackTen);
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
                      setSpinner(false);
                    });

                  stackTen = [];
                }
              }
            }
          }
        });
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

  const openLocationModal = () => {
    RNGooglePlaces.openAutocompleteModal({
      // country: 'TR',
      type: 'cities',
    })
      .then(async (place) => {
        console.log('place', place);

        // TEST ICIN
        let country = null;
        let city = null;
        let district = null;
        let indexAddress = place.addressComponents.length - 1;
        let findCOuntry = false;

        while (0 <= indexAddress && !findCOuntry) {
          if (place.addressComponents[indexAddress].types[0] === 'country') {
            findCOuntry = true;
            country = place.addressComponents[indexAddress].shortName;
          }
          indexAddress--;
        }

        indexAddress = place.addressComponents.length - 1;

        switch (country) {
          case 'TR':
            for (let i = 0; i <= indexAddress; i++) {
              if (
                place.addressComponents[i].types[0] ===
                'administrative_area_level_1'
              ) {
                
                const result = await translate([place.addressComponents[i].name, 'Türkiye'], {
                  q: "tr",
                  target: "en",
                });

                city = result[0];

              } else if (
                place.addressComponents[i].types[0] ===
                'administrative_area_level_2'
              ) {
                const result = await translate([place.addressComponents[i].name, 'Türkiye'], {
                  q: "tr",
                  target: "en",
                });

                district = result[0];
              }
            }
            break;
          default:
            break;
        }

        console.log('country', convertLowerString(country));
        console.log('city', city);
        console.log('district', district);

        if (
          country != 'TR'
        ) {
          const result = `The city is not in ${location.country_name}`;
          console.log('sonuc', result);
          setSelectedCity(result);
          setInCountry(false);
          getFirebase('');
        } else {
          console.log('burda city', city)
          setSelectedCity(city);
          getFirebase(city);
        }

        // console.log('country', convertLowerString(location.country_name));
      })
      .catch((error) => {
        console.log(error.message)
        setSpinner(false);
      }); // error is a Javascript Error object
  };

  const updateLocation = () => {
    let country: any = null;
    let city: any = null;
    let district: any = null;
    let latitude: any = null;
    let longitude: any = null;


    Geolocation.getCurrentPosition((info) => {
      latitude = info.coords.latitude;
      longitude = info.coords.longitude;

      setSpinner(true);
      
      console.log('-----info', info);
      Geocoder.from(info.coords.latitude, info.coords.longitude)
        .then((place) => {
          // var basic = json.results[json.results.length - 1].address_components;
          console.log('-----location', place);

          let indexAddress = place.results.length - 1;
          let findCOuntry = false;

          // Ulkeye gore filtrelemek icin once ulke bulunur
          while (0 <= indexAddress && !findCOuntry) {
            if (place.results[indexAddress].types[0] === 'country') {
              findCOuntry = true;
              country =
                place.results[indexAddress].address_components[0].long_name;
            }
            indexAddress--;
          }

          indexAddress = place.results.length - 1;

          switch (country) {
            case 'Turkey':
            case 'Turkiye':
              for (let i = 0; i <= indexAddress; i++) {
                if (
                  place.results[i].types[0] === 'administrative_area_level_1'
                ) {
                  city = place.results[i].address_components[0].long_name;
                } else if (
                  place.results[i].types[0] === 'administrative_area_level_2'
                ) {
                  district = place.results[i].address_components[0].long_name;
                }
              }
              break;

            default:
              for (let i = 0; i <= indexAddress; i++) {
                if (
                  place.results[i].types[0] === 'administrative_area_level_1'
                ) {
                  city = place.results[i].address_components[0].long_name;
                } else if (
                  place.results[i].types[0] === 'administrative_area_level_2'
                ) {
                  district = place.results[i].address_components[0].long_name;
                }
              }
              break;
          }

          console.log('country', country);
          console.log('city', city);
          console.log('district', district);
          // const city = 'Ekrem'; //basic[basic.length - 2].long_name;
          // const latitude = info.coords.latitude;
          // const longitude = info.coords.longitude;

          setSelectedCity(city);
          Alert.alert('selectedcity', convertLowerString(selectedCity));
          Alert.alert('city', convertLowerString(city));
          console.log('-------', selectedCity);
          console.log('-------', city);
          setSpinner(false);
          if (convertLowerString(selectedCity) !== convertLowerString(city)) {
            getFirebase(city);
            console.log('Sorguda');
          } else {
            console.log('Sorgu yok');
          }
        })
        .catch((error) => {
          setSpinner(false);
          console.warn('updateLocation', error)
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
              selectedCity == null && location != undefined && location.city != undefined
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
                        x.owner.email !== user.email &&
                        (x.gender == user.gender || x.gender == null) &&
                        ((x.minAge <= user.age && x.maxAge >= user.age) ||
                          x.minAge == null)) ||
                      (user != undefined && x.owner.email === user.email) ||
                      user == undefined
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
