import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ContextApi from 'context/ContextApi';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NotificationScreen = () => {
  const { user } = useContext(ContextApi);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotificationsInfo();

  }, []);

  const getNotificationsInfo = () => {
    let notificationArray = [];
    console.log('---------', user);
    firestore()
      .collection('Notifications')
      .where('toWho', '==', user.email)
      .where('state', '==', true)
      .onSnapshot((noti) => {
        console.log('noti', noti.docs);
        notificationArray = [];
        noti.docs.forEach((item) => {
          notificationArray.push(item.data());
        });
        setNotifications([...notificationArray]);
      });
  };

  const findPicture = (type: string) => {
    switch (type) {
      case 'basketball':
        return require('assets/img/basketball.png');
      case 'bicycle':
        return require('assets/img/bicycle.png');
      case 'hiking':
        return require('assets/img/hiking.png');
      case 'jogging':
        return require('assets/img/jogging.png');
      case 'tennis':
        return require('assets/img/tennis.png');
      default:
        return require('assets/img/join.png');
    }
  };

  const deleteNotification = async (item: Object) => {
    console.log('item', item)
    const result = await firestore()
    .collection('Notifications')
    .where('acitivityId', '==', item.activityId)
    .where('toWho', '==', user.email)
    .get();

    console.log('sonuc', result.docs)
  }

  const showButton = (
    <View style={{ flexDirection: 'row', marginTop: 5, }}>
      <View style={{ marginEnd: 10, flex: 1 }}>
        <Button title="Decline" color={'red'} onPress={() => {}} />
      </View>
      <View style={{ flex: 1, marginEnd: '30%' }}>
      <Button title="Accept" color={'#37CC4A'} onPress={() => {}} />
      </View>
    </View>
  );

  return (
    <View style={{ marginTop: 10 }}>
      {notifications != [] &&
        notifications
          .sort((a, b) => {
            return b.createdTime - a.createdTime;
          })
          .map((item) => (
            <View key={item.createdTime} style={styles.viewContainer}>
              <View style={styles.viewLeft}>
                <Image source={findPicture(item.branch)} style={styles.icon} />
              </View>
              <View style={styles.viewRight}>
                <View style={{ flexDirection: 'row', }}>
                <Text style={{flex: 4}}>{item.title}</Text>
                  <Ionicons
                    size={20}
                    name={'trash-outline'}
                    style={{ color: 'gray', flex: 1 }}
                    onPress={() => deleteNotification(item)}
                  />
                </View>
                <Text style={styles.textBody}>{item.body}</Text>
                {item.type === 0 && showButton}
              </View>
            </View>
          ))}
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    height: 90,
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
  viewRight: {
    flex: 5,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    // backgroundColor: 'red',
  },
  textBold: {
    fontWeight: 'bold',
  },
  textBody: {
    paddingTop: 3,
    fontSize: 12,
    color: '#515151',
  },
});

export default NotificationScreen;
