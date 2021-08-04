import React from 'react';
import { useEffect, useContext, useState } from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import ContextApi from 'context/ContextApi';

const noti = [
  {
    id: 0,
    pic: require('assets/img/jogging.png'),
    boldText: 'Koşmaya var mısın?',
    text: 'etkinliğinin güzergahı değişti',
    date: 'April 8',
    time: '20:00',
  },
  {
    id: 1,
    pic: require('assets/img/hiking.png'),
    boldText: 'Yokuşsever Konyalılar Toplanıyor',
    text: 'etkinliği yarın başlıyor',
    date: 'April 11',
    time: '23:00',
  },
  {
    id: 2,
    pic: require('assets/img/bicycle.png'),
    boldText: 'İki teker Karaköy Turu',
    text: 'etkinliği iptal edildi',
    date: 'April 18',
    time: '09:00',
  },
];

let activityId = [];
let activityTemp = [];
let ownerActivity = [];

const MyActivitiesScreen = () => {
  const { user } = useContext(ContextApi);
  const [spinner, setSpinner] = useState<boolean>(true);
  const [activityOwnerList, setActivityOwnerList] = useState(null);
  const [activityMemberList, setActivityMemberList] = useState(null);

  useEffect(() => {
    getFirebase();
  }, []);

  const getFirebase = async () => {
    await firestore()
      .collection('Activities')
      .where('owner.email', '==', user.email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          console.log('1', documentSnapshot.data());
          ownerActivity.push(documentSnapshot.data());
        });
        setActivityOwnerList(ownerActivity);
      });

    await firestore()
      .collection('Members')
      // .where('country', '==', location.country_name)
      // .where('cityEng', '==', convertLowerString(location.city))
      .where('memberEmail', '==', user.email)
      .where('ownerState', '==', true)
      // .where('time', '<=', new Date().getTime() + 30 * 86400000)
      .onSnapshot((querySnapshot) => {
        // console.log('Total users: ', querySnapshot.size);

        querySnapshot.forEach((documentSnapshot) => {
          console.log(
            'Activity Address: ',
            documentSnapshot.id,
            documentSnapshot.data()
          );

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
                    setActivityMemberList([...activityTemp]);
                    setSpinner(false);
                  });

                stackTen = [];
              }
            }
          }
        }
      })
      .catch((e) => {
        setSpinner(false);
        setActivityMemberList(null);
      });
  };

  return (
    <View style={{ marginTop: 10 }}>
      {activityOwnerList != null &&
        activityOwnerList.map((item) => (
          <View key={item.id} style={styles.viewContainer}>
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
              <Text style={styles.textBold}>{item.name} (Owner)</Text>
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
          </View>
        ))}
        {activityOwnerList != null && activityOwnerList.length > 0 && <View style={{borderWidth: 0.5}} />}
        {activityMemberList != null &&
        activityMemberList.map((item) => (
          <View key={item.id} style={styles.viewContainer}>
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
              <Text style={styles.textBold}>{item.name}</Text>
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
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    height: 90,
    borderBottomWidth: 1,
    borderColor: '#CCC',
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
