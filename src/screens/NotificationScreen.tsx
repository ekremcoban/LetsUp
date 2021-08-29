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
import { selectImg } from 'utilities/constants/selectImage';

let activityId = [];
let activityTemp = [];
let ownerActivity = [];
let address = [];

const NotificationScreen = () => {
  const navigation = useNavigation();
  const { user, notifications } = useContext(ContextApi);
  const [activityOwnerList, setActivityOwnerList] = useState(null);
  const [activityMemberList, setActivityMemberList] = useState(null);
  const [addressList, setAddressList] = useState(null);
  const [spinner, setSpinner] = useState<boolean>(false);

  useEffect(() => {
    getFirebase();
  }, []);


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

  const getFirebase = async () => {
    if (user != null) {
      await firestore()
        .collection('Activities')
        .where('owner.email', '==', user.email)
        .where('isDeleted', '==', null)
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
          // console.log('activityId 1', activityId);

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
                    // console.log('activityTemp 1', activityTemp);
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
                      // console.log('activityTemp 2', activityTemp);
                      setActivityMemberList([...activityTemp]);
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

  const goToActivityInfo = async (item: Object) => {
    isReadNotification(item);
    console.log('user', user)
    console.log('item', item)
    console.log('activityOwnerList', activityOwnerList)
    console.log('activityMemberList', activityMemberList)
    const activityOwner = activityOwnerList.filter(activity => activity.id === item.activityId);
    const activityMember = activityMemberList.filter(activity => activity.id === item.activityId);

    if (activityOwner.length > 0 && user.email == activityOwner[0].owner.email && (activityOwner[0].isCanceled != true && activityOwner[0].isDeleted != true)) {
      console.log('AKTİVİTE SAHİBİ')
      navigation.navigate('Owner Old Activity Info', {
        activity: activityOwnerList.filter(activity => activity.id === item.activityId)[0],
      });
    } else if (activityMember[0].isCanceled != true && activityMember[0].isDeleted != true) {
      console.log('AKTİVİTE ÜYESİ')
      navigation.navigate('Member Old Activity Info', {
        activity: activityMemberList.filter(activity => activity.id === item.activityId)[0],
      })
    }
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
                        source={selectImg(item.branch)}
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
                        <Text style={{ paddingEnd: 10 }}>
                          {new Date(item.createdTime)
                            .toString()
                            .substring(0, 10)}
                        </Text>
                        <Ionicons
                          size={20}
                          name={'trash-outline'}
                          style={{ color: 'gray', flex: 1 }}
                          onPress={() =>
                            deleteNotification(
                              'Deleting',
                              'Are you sure ?',
                              item
                            )
                          }
                        />
                      </View>
                      <Text style={styles.textBody}>{item.body}</Text>
                      {item.type === 0 && item.isActive && showButton(item)}
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
