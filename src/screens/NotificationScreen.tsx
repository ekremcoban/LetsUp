import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ContextApi from 'context/ContextApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import DisplaySpinner from '../components/spinner';

const NotificationScreen = () => {
  const { user } = useContext(ContextApi);
  const [notifications, setNotifications] = useState([]);
  const [spinner, setSpinner] = useState<boolean>(false);

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
        setSpinner(false);
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

  const deleteNotification = async (
    title: string,
    content: string,
    item: Object
  ) => {
    Alert.alert(title, content, [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          let temp = item;
          temp.state = false;

          const result = await firestore()
            .collection('Notifications')
            .doc(temp.id)
            .set(temp);
        },
      },
    ]);
  };

  const accept = (title: string, content: string, item: Object) => {
    console.log('item', item);
    Alert.alert(title, content, [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          setSpinner(true);
          const member = await firestore()
            .collection('Members')
            .doc(item.membersId)
            .get();

          console.log('mem', member.data());
          let temp = member.data();
          temp.ownerState = true;

          const result = await firestore()
            .collection('Members')
            .doc(item.membersId)
            .set(temp);
        },
      },
    ]);
  };

  const denied = (title: string, content: string, item: Object) => {
    console.log('item', item);
    Alert.alert(title, content, [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          setSpinner(true);
          const member = await firestore()
            .collection('Members')
            .doc(item.membersId)
            .get();

          console.log('mem', member.data());
          let temp = member.data();
          temp.ownerState = false;

          const result = await firestore()
            .collection('Members')
            .doc(item.membersId)
            .set(temp);
        },
      },
    ]);
  };

  const showButton = (item: Object) => {
    return (
      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        <View style={{ marginEnd: 10, flex: 1 }}>
          <Button
            title="Decline"
            color={'red'}
            onPress={() => denied('Warning', 'Are you sure ?', item)}
          />
        </View>
        <View style={{ flex: 1, marginEnd: '30%' }}>
          <Button
            title="Accept"
            color={'#37CC4A'}
            onPress={() => accept('Warning', 'Are you sure ?', item)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1,}}>
        {spinner && <DisplaySpinner /> }
    <ScrollView>
      <View style={{ marginTop: 10 }}>
        {notifications != [] &&
          notifications
            .sort((a, b) => {
              return b.createdTime - a.createdTime;
            })
            .map((item, index) => {
              return (
                <View key={item.createdTime} 
                style={
                  index % 2
                    ? [styles.viewContainer, { backgroundColor: '#E5E5E5' }]
                    : styles.viewContainer
                }>
                  <View style={styles.viewLeft}>
                    <Image
                      source={findPicture(item.branch)}
                      style={styles.icon}
                    />
                  </View>
                  <View style={styles.viewRight}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ flex: 4 }}>{item.title}</Text>
                      <Ionicons
                        size={20}
                        name={'trash-outline'}
                        style={{ color: 'gray', flex: 1 }}
                        onPress={() =>
                          deleteNotification('Warning', 'Are you sure ?', item)
                        }
                      />
                    </View>
                    <Text style={styles.textBody}>{item.body}</Text>
                    {item.type === 0 && item.isActive && showButton(item)}
                  </View>
                </View>
              );
            })}
      </View>
    </ScrollView>
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
