import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ContextApi from 'context/ContextApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import DisplaySpinner from '../components/spinner';
import { useNavigation } from '@react-navigation/native';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const { notifications } = useContext(ContextApi);
  const [spinner, setSpinner] = useState<boolean>(false);

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
      case 'table_tennis':
        return require('assets/img/table_tennis.png');
      case 'tennis':
        return require('assets/img/tennis.png');
      case 'volleyball':
        return require('assets/img/volleyball.png');
      case 'badminton':
        return require('assets/img/badminton.png');
      case 'meditation':
        return require('assets/img/meditation.png');
      case 'roller_skate':
        return require('assets/img/roller_skate.png');
      case 'skateboard':
        return require('assets/img/skateboard.png');
      default:
        return require('assets/img/join.png');
    }
  };

  const isReadNotification = async (item: Object) => {
    let temp = item;
    temp.isRead = true;

    await firestore().collection('Notifications').doc(temp.id).set(temp);
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
          temp.isRead = true;

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
          isReadNotification(item);
          const member = await firestore()
            .collection('Members')
            .doc(item.membersId)
            .get();

          console.log('mem', member.data());
          let temp = member.data();
          temp.ownerState = true;
          temp.isRead = true;

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
          isReadNotification(item);
          setSpinner(true);
          const member = await firestore()
            .collection('Members')
            .doc(item.membersId)
            .get();

          console.log('mem', member.data());
          let temp = member.data();
          temp.ownerState = false;
          temp.isRead = true;

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

  const goToActivityInfo = async (noti: Object) => {
    console.log('aaaaa', noti)
    const activity = await firestore()
    .collection('Activities')
    .where('id', '==', noti.activityId)
    .get();

    navigation.navigate('Member Old Activity Info', {
      activity: activity.docs[0].data(),
    })
  };

  return (
    <View style={{ flex: 1 }}>
      {spinner && <DisplaySpinner />}
      <ScrollView>
        <View style={{ marginTop: 10 }}>
          {notifications != [] &&
            notifications
              .sort((a, b) => {
                return b.createdTime - a.createdTime;
              })
              .map((item, index) => {
                return (
                  <View
                    key={item.createdTime}
                    style={
                      index % 2
                        ? [styles.viewContainer, { backgroundColor: '#E5E5E5' }]
                        : styles.viewContainer
                    }
                  >
                    <View style={styles.viewLeft}>
                      <Image
                        source={findPicture(item.branch)}
                        style={styles.icon}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.viewRight}
                      onPress={() =>
                        item.type !== 6
                          ? isReadNotification(item)
                          : goToActivityInfo(item)
                      }
                    >
                      <View style={{ flexDirection: 'row' }}>
                        <Text
                          style={
                            item.isRead
                              ? { flex: 4 }
                              : { flex: 4, color: 'green' }
                          }
                        >
                          {item.title}
                        </Text>
                        <Text style={{ paddingEnd: 20 }}>
                          {new Date(item.createdTime)
                            .toString()
                            .substring(0, 10)}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          justifyContent: 'space-between',
                          paddingEnd: 20,
                        }}
                      >
                        <Text style={styles.textBody}>{item.body}</Text>
                        {item.type === 0 && item.isActive && showButton(item)}
                        <Ionicons
                          size={20}
                          name={'trash-outline'}
                          style={{ color: 'gray' }}
                          onPress={() =>
                            deleteNotification(
                              'Deleting',
                              'Are you sure ?',
                              item
                            )
                          }
                        />
                      </View>
                    </TouchableOpacity>
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
