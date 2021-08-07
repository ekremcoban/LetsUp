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
import { useNavigation, useRoute } from '@react-navigation/native';
import { getData } from 'db/localDb';

const OwnerInfoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, userPhoto } = useContext(ContextApi);
  const [photoPath, setPhotoPath] = useState<string>('');

  useEffect(() => {
    console.log('-----', route.params.data)
    const unsubscribe = navigation.addListener('focus', () => {

    })

    return () => {
        unsubscribe;
      };
    }, [navigation]);

  return (
    <>
      <View style={styles.containerFirst}>
        <View style={styles.viewImg}>
          <Image
            source={{ uri: route.params.data.photo }}
            style={styles.image}
          />
        </View>
      </View>
      <View style={styles.viewInfo}>
        <Text style={styles.textTitle}>
          {route.params.data.name} {route.params.data.surname}
        </Text>
        <View style={styles.viewFirst}>
          <Text style={styles.textFirst}>
            {route.params.data.age}, {route.params.data.city},{' '}
            {route.params.data.country}
          </Text>
        </View>
        <View style={styles.viewSecond}>
          <View style={{ flex: 1 }} />
          <View style={styles.viewSecondCol1}>
            <Text style={styles.textSecondCol1Title}>Height</Text>
            <Text style={styles.textSecondCol1Text}>
              {route.params.data != null && route.params.data.height != null && route.params.data.height[0] != null
                ? route.params.data.height[0] + ',' + route.params.data.height[1]
                : '---'}
            </Text>
          </View>
          <View style={styles.viewSecondCol2}>
            <Text style={styles.textSecondCol2Title}>Weight</Text>
            <Text style={styles.textSecondCol2Text}>
              {route.params.data != null && route.params.data.weight != null && route.params.data.weight[0] != null
                ? route.params.data.weight[0] + ',' + route.params.data.weight[1]
                : '---'}
            </Text>
          </View>
          <View style={styles.viewSecondCol3}>
            <Text style={styles.textSecondCol3Title}>Gender</Text>
            <Text style={styles.textSecondCol3Text}>
              {route.params.data != null && route.params.data.gender != '' ? route.params.data.gender : '---'}
            </Text>
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </View>
      {/* <View style={styles.viewPast}>
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
      </View> */}
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
    marginTop: 50,
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

export default OwnerInfoScreen;
