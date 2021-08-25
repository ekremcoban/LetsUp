import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePickerCropper from 'react-native-image-crop-picker';
import ContextApi from 'context/ContextApi';
import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getData } from 'db/localDb';
import firestore from '@react-native-firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { selectImg } from 'utilities/constants/selectImage';
import { filter } from 'lodash';

const ProfileInfoScreen = () => {
  const navigation = useNavigation();
  const { user, userPhoto } = useContext(ContextApi);
  const [photoPath, setPhotoPath] = useState<string>(null);
  const [whichTab, setWhichTab] = useState<number>(0);
  const [myJoinedActivities, setMyJoinedActivities] = useState<Object>(
    undefined
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {

      getData('Photo').then((res) => {
        setPhotoPath(res);
        if (res == null) {
          getData('Users').then((res) => {
            setPhotoPath(res.photo);
          });
        }
      });
    });

    getMyActivities();

    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const getMyActivities = async () => {
    let myJoinedActivities = [];

    const resultMyActivities = await firestore()
      .collection('Activities')
      .where('owner.email', '==', user.email)
      .where('state', '==', false)
      .get();

    resultMyActivities.docs.forEach(async (myActivity) => {
      let isJoined = 1;
      let members = [];

      let resultFeedbackMembers = await firestore()
        .collection('Members')
        .where('activityId', '==', myActivity.data().id)
        .get();

        resultFeedbackMembers.docs.forEach(mem => {
          members.push(mem.data())
        })        

        const orderedMember = members.sort((a, b) => {
          return b.createdTime - a.createdTime;
        })

      // console.log('resultFeedbackMembers.docs.', resultFeedbackMembers.docs);
      // console.log('sıralı', orderedMember[0]);
      //   console.log('myActivity', myActivity.data().name, resultFeedbackMembers.docs)
        if (orderedMember[0].ownerJoin != false) {
          isJoined = 1;
          // console.log('**********', myActivity.data().name);
        } else {
          isJoined = 0;
          // console.log('------------', myActivity.data().name);
        }

      if (myJoinedActivities.length === 0) {
        // console.log('İLK', orderedMember[0]);
        myJoinedActivities.push({
          type: myActivity.data().type,
          ownerRating: orderedMember[0].ownerRating != null ? orderedMember[0].ownerRating : 0,
          ratingCount: orderedMember[0].ownerRating != null ? 1 : 0, 
          isJoined: isJoined,
          count: 1,
        });
      } else {
        let isThereActivity = myJoinedActivities.filter(
          (myJoinedActivity) => myJoinedActivity.type === myActivity.data().type
        );

        if (isThereActivity.length === 0) {
          // console.log('EKLE', orderedMember[0],myActivity.data().name);
          myJoinedActivities.push({
            type: myActivity.data().type,
            ownerRating: orderedMember[0].ownerRating != null ? orderedMember[0].ownerRating : 0,
            ratingCount: orderedMember[0].ownerRating != null ? 1 : 0, 
            isJoined: isJoined,
            count: 1,
          });
        } else {
          // const countTemp = isThereActivity[0].count;
          // const isJoinedTemp = isThereActivity[0].isJoined;
          // const ratingCountTemp = isThereActivity[0].ratingCount;
          // const ownerRatingTemp = isThereActivity[0].ownerRating;

          // console.log('isJoinedTemp', isJoinedTemp)
          // console.log('ratingCountTemp', ratingCountTemp)
          // console.log('ownerRatingTemp', ownerRatingTemp)

          // console.log('GÜNCELLE', orderedMember[0],myActivity.data().name);
          const rating = orderedMember[0].ownerRating != null ? orderedMember[0].ownerRating : 0
          const ratingCount = orderedMember[0].ownerRating != null ? 1  : 0;

          // console.log('rating', rating);
          // console.log('ratingCount', ratingCount);
          // console.log('isThereActivity[0].ownerRating', ownerRatingTemp);
          // console.log('isThereActivity[0].isJoined', isJoinedTemp);
   
          isThereActivity[0].count += 1;
          isThereActivity[0].isJoined += isJoined;
          isThereActivity[0].ratingCount += ratingCount,
          isThereActivity[0].ownerRating += rating;
          // console.log('********', ownerRatingTemp)
        }
      }
      // console.log('myJoinedActivities', myJoinedActivities);
      setMyJoinedActivities([...myJoinedActivities]);
    });
 
    // console.log('myJoinedActivities', myJoinedActivities);
  };

  const photo = () => {
    ImagePickerCropper.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        console.log(image.path);
        setPhotoPath(image.path);
      })
      .catch((e) => {
        if (e.code === 'E_NO_IMAGE_DATA_FOUND') {
          Alert.alert('Warning', 'Selected photo must be png or jpeg format');
        }
        console.error('photo error', e);
      });
  };

  const myActivities = () => {
    const showMyJoined =
      myJoinedActivities != undefined &&
      myJoinedActivities
        .sort((a, b) => {
          return b.count - a.count;
        })
        // .filter(item => item.count > 0)
        .map((item) => (
          <View style={styles.viewItemHorizontal}>
            <View style={styles.viewItemCol1}>
              <Image source={selectImg(item.type)} style={styles.icon} />
            </View>
            <View style={styles.viewItemCol2}>
              <Text style={styles.textItem}>{item.type}</Text>
            </View>
            <View style={styles.viewItemCol3}>
              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Text style={styles.joinedTitle}>Skill</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}
              >
                <Text style={styles.joinedText}>{item.ownerRating != null && item.ratingCount ? (item.ownerRating / item.ratingCount).toFixed(1) : '-'}</Text>
              </View>
            </View>
            <View style={styles.viewItemCol4}>
              <Text style={styles.joinedTitle}>Joined</Text>
              {myJoinedActivities != undefined && (
                <Text style={styles.joinedText}>
                  {item.isJoined + '/' + item.count}
                </Text>
              )}
            </View>
          </View>
        ));

    return (
      <View style={styles.viewItems}>
        <ScrollView>{showMyJoined}</ScrollView>
      </View>
    );
  };

  const asAMembers = () => {
    const showMyJoined =
      myJoinedActivities != undefined &&
      myJoinedActivities
        .sort((a, b) => {
          return b.count - a.count;
        })
        // .filter(item => item.count > 0)
        .map((item) => (
          <View style={styles.viewItemHorizontal}>
            <View style={styles.viewItemCol1}>
              <Image source={selectImg(item.type)} style={styles.icon} />
            </View>
            <View style={styles.viewItemCol2}>
              <Text style={styles.textItem}>{item.type}</Text>
            </View>
            <View style={styles.viewItemCol3}>
              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Text style={styles.joinedTitle}>Skill</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}
              >
                <Text style={styles.joinedText}>{item.ownerRating != null && (item.ownerRating / item.ratingCount).toFixed(1)}</Text>
              </View>
            </View>
            <View style={styles.viewItemCol4}>
              <Text style={styles.joinedTitle}>Joined</Text>
              {myJoinedActivities != undefined && (
                <Text style={styles.joinedText}>
                  {item.isJoined + '/' + item.count}
                </Text>
              )}
            </View>
          </View>
        ));

    return (
      <View style={styles.viewItems}>
        <ScrollView>{showMyJoined}</ScrollView>
      </View>
    );
  };

  return (
    <>
      <View style={styles.containerFirst}>
        <TouchableOpacity
          style={{ alignSelf: 'flex-end' }}
          onPress={() =>
            navigation.navigate('Create Profile', { from: 'Profile Info' })
          }
        >
          <View style={styles.viewbuttonAction}>
            <Text style={styles.textButtonAction}>Edit</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.viewImg}>
          {/* <View style={{ flex: 1}} /> */}
          {photoPath != null && (
            <Image
              source={{ uri: photoPath }}
              // source={require(photoPath)}
              style={styles.image}
            />
          )}
          {/* <View style={styles.viewIcon}>
                        <Icon size={30} name="camera-outline" type="ionicon" onPress={() => photo()} />
                    </View> */}
        </View>
      </View>
      <View style={styles.viewInfo}>
        <Text style={styles.textTitle}>
          {user != null && user.name} {user != null && user.surname}
        </Text>
        <View style={styles.viewFirst}>
          <Text style={styles.textFirst}>
            {user != null && user.age}, {user != null && user.city},{' '}
            {user != null && user.country}
          </Text>
        </View>
        <View style={styles.viewSecond}>
          <View style={{ flex: 1 }} />
          <View style={styles.viewSecondCol1}>
            <Text style={styles.textSecondCol1Title}>Height</Text>
            <Text style={styles.textSecondCol1Text}>
              {user != null && user.height != null && user.height[0] != null
                ? user.height[0] + ',' + user.height[1]
                : '---'}
            </Text>
          </View>
          <View style={styles.viewSecondCol2}>
            <Text style={styles.textSecondCol2Title}>Weight</Text>
            <Text style={styles.textSecondCol2Text}>
              {user != null && user.weight != null && user.weight[0] != null
                ? user.weight[0] + ',' + user.weight[1]
                : '---'}
            </Text>
          </View>
          <View style={styles.viewSecondCol3}>
            <Text style={styles.textSecondCol3Title}>Gender</Text>
            <Text style={styles.textSecondCol3Text}>
              {user != null && user.gender != '' ? user.gender : '---'}
            </Text>
          </View>
          <View style={{ flex: 1 }} />
        </View>
        {/* <View style={styles.viewThird}>
                    <Text style={styles.textThirdTitle}>Interested In</Text>
                    <Text style={styles.textThirdText}>Tennis, Basketball</Text>
                </View> */}
      </View>
      <View style={styles.viewPast}>
        <View style={styles.viewTitle}>
          <TouchableOpacity
            style={styles.viewTitleCol1}
            onPress={() => setWhichTab(0)}
          >
            <Text style={styles.textCol1}>My Activities</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewTitleCol2}
            onPress={() => setWhichTab(1)}
          >
            <Text>As A Member</Text>
          </TouchableOpacity>
        </View>
        {whichTab === 0 ? myActivities() : null}
      </View>
      <View style={{ flex: 1 }} />
    </>
  );
};

const styles = StyleSheet.create({
  containerFirst: {
    flex: 2.5,
  },
  viewbuttonAction: {
    height: 40,
    width: 80,
    marginTop: 10,
    marginEnd: 10,
    flexDirection: 'row',
    backgroundColor: '#37CC4A',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonAction: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewImg: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  viewIcon: {
    flex: 1,
    alignSelf: 'flex-end',
    // backgroundColor: 'orange'
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 75,
  },

  viewInfo: {
    flex: 2,
    // padding: 12,
    // backgroundColor: 'orange'
  },
  textTitle: {
    fontSize: 22, //width * 0.07,
    fontWeight: '500',
    textAlign: 'center',
    color: '#515151',
  },
  viewFirst: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'blue',
  },
  textFirst: {
    color: '#515151',
    fontSize: 15,
  },
  viewSecond: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'orange',
  },
  viewThird: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'orange',
  },
  viewSecondCol1: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  textSecondCol1Title: {
    color: '#515151',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textSecondCol1Text: {
    color: '#515151',
    paddingTop: 3,
    fontSize: 13,
    textAlign: 'center',
  },
  viewSecondCol2: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  textSecondCol2Title: {
    color: '#515151',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textSecondCol2Text: {
    color: '#515151',
    paddingTop: 3,
    fontSize: 13,
    textAlign: 'center',
  },
  viewSecondCol3: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  textSecondCol3Title: {
    color: '#515151',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textSecondCol3Text: {
    color: '#515151',
    paddingTop: 3,
    fontSize: 13,
    textAlign: 'center',
  },
  textSecondCol2: {
    padding: 10,
    color: '#515151',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textSecondCol3: {
    padding: 10,
    color: '#515151',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textThirdTitle: {
    color: '#515151',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textThirdText: {
    color: '#515151',
    fontSize: 15,
  },

  viewPast: {
    flex: 3,
    // padding: 12,
    // backgroundColor: 'orange'
  },
  viewTitle: {
    flex: 1,
    // backgroundColor: 'yellow',
    flexDirection: 'row',
  },
  viewItems: {
    flex: 4,
    // backgroundColor: 'red'
  },
  viewTitleCol1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: '#37CC4A',
  },
  textCol1: {
    color: '#37CC4A',
    fontWeight: 'bold',
  },
  viewTitleCol2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#C4C4C4',
  },
  viewItemHorizontal: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    borderWidth: 1,
    borderColor: '#C4C4C4',
  },
  viewItemCol1: {
    flex: 1,
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewItemCol2: {
    flex: 2,
    backgroundColor: 'orange',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  viewItemCol3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  viewItemCol4: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinedTitle: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  joinedText: {
    fontSize: 12,
  },
  textItem: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export default ProfileInfoScreen;
