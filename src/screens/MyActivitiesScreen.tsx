import React from 'react';
import { useEffect, useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import ContextApi from 'context/ContextApi';
import { colors } from 'utilities/constants/globalValues';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

let activityId = [];
let activityTemp = [];
let ownerActivity = [];
let address = [];

const MyActivitiesScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(ContextApi);
  const [spinner, setSpinner] = useState<boolean>(true);
  const [activityOwnerList, setActivityOwnerList] = useState(null);
  const [activityMemberList, setActivityMemberList] = useState(null);
  const [addressList, setAddressList] = useState(null);
  const [ownerShow, setOwnerShow] = useState<Boolean>(true);

  useEffect(() => {
    getFirebase();
  }, []);

  const getFirebase = async () => {
    await firestore()
      .collection('Activities')
      .where('owner.email', '==', user.email)
      .onSnapshot((querySnapshot) => {
        ownerActivity = [];
        querySnapshot.forEach((documentSnapshot) => {
          firestore()
            .collection('ActivityAddress')
            .where('activityId', '==', documentSnapshot.data().id)
            .get()
            .then((items) => {
              address.push(items.docs[0].data());
              setAddressList(address);
            });
          ownerActivity.push(documentSnapshot.data());
        });
        setActivityOwnerList(ownerActivity);
      });

    await firestore()
      .collection('Members')
      .where('memberEmail', '==', user.email)
      .where('ownerState', '==', true)
      .onSnapshot((querySnapshot) => {

        querySnapshot.forEach((documentSnapshot) => {
          activityId.push(documentSnapshot.data().activityId);
        });
        console.log('activityId 1', activityId);

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
              firestore()
                .collection('Activities')
                .where('id', 'in', stackTen)
                // .where('ime', '>', 1626820440000)
                .onSnapshot((documentSnapshot) => {
                  documentSnapshot.docs.forEach((documentSnapshot) => {
                    firestore()
                    .collection('ActivityAddress')
                    .where('activityId', '==', documentSnapshot.data().id)
                    .get()
                    .then((items) => {
                      address.push(items.docs[0].data());
                      setAddressList(address);
                    });
                    // console.log('User data: ', s.data());
                    const isIt = activityTemp.filter(
                      (a) => a.id === documentSnapshot.data().id
                    );

                    if (isIt.length === 0) {
                      activityTemp.push(documentSnapshot.data());
                    }
                  });
                  console.log('activityTemp 1', activityTemp);
                  setActivityMemberList([...activityTemp]);
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
                    documentSnapshot.docs.forEach((documentSnapshot) => {
                      firestore()
                      .collection('ActivityAddress')
                      .where('activityId', '==', documentSnapshot.data().id)
                      .get()
                      .then((items) => {
                        address.push(items.docs[0].data());
                        setAddressList(address);
                      });
                      // console.log('User data: ', s.data());
                      const isIt = activityTemp.filter(
                        (a) => a.id === documentSnapshot.data().id
                      );

                      if (isIt.length === 0) {
                        activityTemp.push(documentSnapshot.data());
                      }
                    });
                    console.log('activityTemp 2', activityTemp);
                    setActivityMemberList([...activityTemp]);
                    setSpinner(false);
                  });

                stackTen = [];
              }
            }
          }
        }
      });
    // .catch((e) => {
    //   setSpinner(false);
    //   setActivityMemberList(null);
    // });
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

  const showAsOwnerPage =
    activityOwnerList != null &&
    activityOwnerList.sort((a, b) => {
      return b.startTime - a.startTime;
    }).map((item, index) => (
      <TouchableOpacity
        key={item.id}
        style={
          index % 2
            ? [styles.viewContainer, { backgroundColor: '#E5E5E5' }]
            : styles.viewContainer
        }
        onPress={() =>
          item.finishTime < new Date().getTime()
            ? navigation.navigate('Owner Old Activity Info', {
                activity: item,
              })
            : navigation.navigate('Activity Info', {
                activity: item,
                getPlace: getPlace,
                addressList: addressList,
              })
        }
      >
        <View style={styles.viewLeft}>
          <Image
            source={
              item.type === 'basketball'
                ? require('assets/img/basketball.png')
                : item.type === 'bicycle'
                ? require('assets/img/bicycle.png')
                : item.type === 'hiking'
                ? require('assets/img/hiking.png')
                : item.type === 'jogging'
                ? require('assets/img/jogging.png')
                : item.type === 'tennis'
                ? require('assets/img/tennis.png')
                : require('assets/img/join.png')
            }
            style={styles.icon}
          />
        </View>
        <View style={styles.viewMiddle}>
          <Text style={item.finishTime < new Date().getTime() ? [styles.textBold, {color: 'gray'}] : styles.textBold}>{item.name}</Text>
          <View style={styles.viewDateTime}>
            <Icon size={20} name="calendar-outline" type="ionicon" />
            <Text style={styles.textDate}>
              {' '}
              {new Date(item.startTime).toString().substring(0, 15)}{' '}
            </Text>
            <Icon size={20} name="time-outline" type="ionicon" />
            <Text style={styles.textDate}>
              {' '}
              {(new Date(item.startTime).getHours() < 10
                ? '0' + new Date(item.startTime).getHours()
                : new Date(item.startTime).getHours()) +
                ':' +
                (new Date(item.startTime).getMinutes() < 10
                  ? '0' + new Date(item.startTime).getMinutes()
                  : new Date(item.startTime).getMinutes())}
            </Text>
          </View>
        </View>
        {/* <View style={styles.viewRight}>
            <Icon
              size={20}
              name="trash-outline"
              type="ionicon"
              onPress={() => Alert.alert('Silim mi :)')}
            />
          </View> */}
      </TouchableOpacity>
    ));

  const showAsMemberPage =
    activityMemberList != null &&
    activityMemberList.sort((a, b) => {
      return b.startTime - a.startTime;
    }).map((item, index) => (
      <TouchableOpacity
        key={item.id}
        style={
          index % 2
            ? [styles.viewContainer, { backgroundColor: '#E5E5E5' }]
            : styles.viewContainer
        }
        onPress={() =>
          item.finishTime < new Date().getTime()
          ? navigation.navigate('Member Old Activity Info', {
              activity: item,
            })
          : navigation.navigate('Activity Info', {
              activity: item,
              getPlace: getPlace,
              addressList: addressList,
            })
        }
      >
        <View style={styles.viewLeft}>
          <Image
            source={
              item.type === 'basketball'
                ? require('assets/img/basketball.png')
                : item.type === 'bicycle'
                ? require('assets/img/bicycle.png')
                : item.type === 'hiking'
                ? require('assets/img/hiking.png')
                : item.type === 'jogging'
                ? require('assets/img/jogging.png')
                : item.type === 'tennis'
                ? require('assets/img/tennis.png')
                : require('assets/img/join.png')
            }
            style={styles.icon}
          />
        </View>
        <View style={styles.viewMiddle}>
        <Text style={item.finishTime < new Date().getTime() ? [styles.textBold, {color: 'gray'}] : styles.textBold}>{item.name}</Text>
          <View style={styles.viewDateTime}>
            <Icon size={20} name="calendar-outline" type="ionicon" />
            <Text style={styles.textDate}>
              {' '}
              {new Date(item.startTime).toString().substring(0, 15)}{' '}
            </Text>
            <Icon size={20} name="time-outline" type="ionicon" />
            <Text style={styles.textDate}>
              {' '}
              {(new Date(item.startTime).getHours() < 10
                ? '0' + new Date(item.startTime).getHours()
                : new Date(item.startTime).getHours()) +
                ':' +
                (new Date(item.startTime).getMinutes() < 10
                  ? '0' + new Date(item.startTime).getMinutes()
                  : new Date(item.startTime).getMinutes())}
            </Text>
          </View>
        </View>
        {/* <View style={styles.viewRight}>
          <Icon
            size={20}
            name="trash-outline"
            type="ionicon"
            onPress={() => Alert.alert('Silim mi :)')}
          />
        </View> */}
      </TouchableOpacity>
    ));
  return (
    <View style={{ marginTop: 10 }}>
      <View
        style={{
          flexDirection: 'row',
          height: 40,
          marginStart: 10,
          marginEnd: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => setOwnerShow(true)}
          style={
            ownerShow
              ? [
                  {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  {
                    borderBottomColor: colors.bar,
                    borderBottomWidth: 2,
                    borderColor: colors.bar,
                  },
                ]
              : styles.asOwnerContainer
          }
        >
          <Text
            style={
              ownerShow
                ? styles.asOwnerText
                : [styles.asOwnerText, { color: 'gray' }]
            }
          >
            As An Owner
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setOwnerShow(false)}
          style={
            !ownerShow
              ? [
                  { flex: 1, justifyContent: 'center', alignItems: 'center' },
                  {
                    borderBottomColor: colors.bar,
                    borderBottomWidth: 2,
                    borderColor: colors.bar,
                  },
                ]
              : styles.asMemberContainer
          }
        >
          <Text
            style={
              !ownerShow
                ? styles.asOwnerText
                : [styles.asOwnerText, { color: 'gray' }]
            }
          >
            As A Member
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 5, marginBottom: 50 }}>
        <ScrollView>
          {ownerShow ? showAsOwnerPage : showAsMemberPage}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  asOwnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  asMemberContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  asOwnerText: {
    color: colors.bar,
    fontWeight: '500',
    fontSize: 15,
  },
  viewContainer: {
    flexDirection: 'row',
    height: 90,
    // borderBottomWidth: 1,
    // borderColor: '#CCC',
  },
  viewLeft: {
    flex: 1,
    padding: 20,
    // backgroundColor: 'red',
  },
  icon: {
    width: 60,
    height: 60,
  },
  viewMiddle: {
    flex: 5,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    // backgroundColor: 'red',
  },
  viewRight: {
    flex: 1,
    justifyContent: 'center',
  },
  textBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  viewDateTime: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textDate: {
    paddingTop: 3,
    fontSize: 12,
    color: '#515151',
  },
});

export default MyActivitiesScreen;
