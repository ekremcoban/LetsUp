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

const ProfileInfoScreen = () => {
  const navigation = useNavigation();
  const { user, userPhoto } = useContext(ContextApi);
  const [photoPath, setPhotoPath] = useState<string>('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        console.log('user', user);

        getData('Photo').then(res => {
            setPhotoPath(res)
            console.log('res', res)
        })
    })

    return () => {
        unsubscribe;
      };
    }, [navigation]);

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

  return (
    <>
      <View style={styles.containerFirst}>
        <TouchableOpacity
          style={{ alignSelf: 'flex-end' }}
          onPress={() => navigation.navigate('Create Profile', {from: 'Profile Info'})}
        >
          <View style={styles.viewbuttonAction}>
            <Text style={styles.textButtonAction}>Edit</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.viewImg}>
          {/* <View style={{ flex: 1}} /> */}
          <Image
            source={{ uri: photoPath }}
            // source={require(photoPath)}
            style={styles.image}
          />
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
              {user != null && user.height[0] != null
                ? user.height[0] + ',' + user.height[1]
                : '---'}
            </Text>
          </View>
          <View style={styles.viewSecondCol2}>
            <Text style={styles.textSecondCol2Title}>Weight</Text>
            <Text style={styles.textSecondCol2Text}>
              {user != null && user.weight[0] != null
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
          <View style={styles.viewTitleCol1}>
            <Text style={styles.textCol1}>My Activities</Text>
          </View>
          <View style={styles.viewTitleCol2}>
            <Text>Joined</Text>
          </View>
        </View>
        <View style={styles.viewItems}>
          <View style={styles.viewItemHorizontal}>
            <View style={styles.viewItemCol1}>
              <Image
                source={require('assets/img/hiking.png')}
                style={styles.icon}
              />
            </View>
            <View style={styles.viewItemCol2}>
              <Text style={styles.textItem}>Adım Adım Zirveye</Text>
            </View>
            <View style={styles.viewItemCol3}>
              <Icon size={20} name="ellipse" type="ionicon" color="green" />
            </View>
          </View>
          <View style={styles.viewItemHorizontal}>
            <View style={styles.viewItemCol1}>
              <Image
                source={require('assets/img/hiking.png')}
                style={styles.icon}
              />
            </View>
            <View style={styles.viewItemCol2}>
              <Text style={styles.textItem}>Rakibim Nerede?</Text>
            </View>
            <View style={styles.viewItemCol3}>
              <Icon size={20} name="ellipse" type="ionicon" color="gray" />
            </View>
          </View>
        </View>
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
    borderWidth: 1,
    borderColor: '#C4C4C4',
  },
  viewItemCol1: {
    flex: 2,
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewItemCol2: {
    flex: 5,
    // backgroundColor: 'yellow',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  viewItemCol3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textItem: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    width: 60,
    height: 60,
  },
});

export default ProfileInfoScreen;
