import React, { useContext } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getData, storeData } from '../db/localDb';
import ContextApi from 'context/ContextApi';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = ({ navigation }: any) => {
  const { profile, setProfile } = useContext(ContextApi);

  const signIn = async (navigation: any) => {
    let profile: Object = {};
    let data: Object = {};

    await getLocation().then(res => {
      data = res;
    })

    GoogleSignin.configure({
      webClientId:
        '302760440961-62l3brhdrhu0372cobb5ted76gtk43pe.apps.googleusercontent.com',
    });

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
  
      const usersCollection = await firestore()
        .collection('Users')
        .doc(userInfo.user.email)
        .get();

        await read(profile, usersCollection, data, userInfo);
    }
    catch (error) {
      console.error('GoogleSignin', error);
    }
  };

  const getLocation = () => {
    return fetch('https://ipapi.co/json/')
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  };

  const read = async (profile: Object, usersCollection: any, data: any, userInfo: any) => {
    try {

      if (usersCollection.exists) {
        const { _data } = usersCollection;
        profile = {
          id: _data.id,
          nick: _data.nick,
          name: _data.name,
          surname: _data.surname,
          age: _data.age,
          gender: _data.gender,
          height: _data.height,
          weight: _data.weight,
          interestedIn: _data.interestedIn,
          photo: _data.photo,
          geoCode: _data.geoCode,
          city: _data.city,
          county: _data.county,
          country: _data.country,
          createdTime: _data.createdTime,
        };
      } else {
        profile = {
          id: userInfo.user.id,
          nick: null,
          name: userInfo.user.givenName,
          surname: userInfo.user.familyName,
          age: null,
          gender: null,
          height: null,
          weight: null,
          interestedIn: null,
          photo: userInfo.user.photo,
          geoCode: null,
          county: null,
          country: data.country_name,
          region: data.region,
          city: data.city,
          createdTime: new Date()
        };
console.log('login', profile)
        firestore()
          .collection('Users')
          .doc(userInfo.user.email)
          .set(profile)
          .then(() => {
            console.log('User added!');
          });
      }

      storeData('Users', profile).then((res) => {
        setProfile(profile);
        if (profile.age == null) {
          navigation.navigate('Create Profile')
        }
        else {
          navigation.goBack()
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          padding: 10,
          paddingStart: 20,
          paddingEnd: 20,
          borderColor: '#BBB',
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
        }}
        onPress={() => signIn(navigation)}
      >
        <Image
          style={{ width: 80, height: 80, resizeMode: 'contain' }}
          source={require('assets/images/logo/google.png')}
        />
        <Text style={{ fontSize: 20 }}>Login With Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginScreen;
