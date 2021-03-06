import React, { useContext } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getData, storeData } from '../db/localDb';
import ContextApi from 'context/ContextApi';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const LoginScreen = ({ navigation }: any) => {
  const { user, setUser, setUserPhoto } = useContext(ContextApi);

  const signIn = async (navigation: any) => {
    let user: Object = {};
    let data: Object = {};

    // ip adresimde lokasyon alindi
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
  
      // Kullanici kayitli mi bilgisi
      const usersCollection = await firestore()
        .collection('Users')
        .doc(userInfo.user.email)
        .get();

        // Kayitli ise vt den, kayit yoksa google dan bilgileri alir
        await retrieveData(user, usersCollection, data, userInfo);
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

  const getImage = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    
    let imageRef = storage().ref(currentUser?.user.email + '.jpeg');
    await imageRef
      .getDownloadURL()
      .then((url) => {
        //from url you can fetched the uploaded image easily
        storeData('Photo', url);
        setUserPhoto(url)
      })
      .catch((e) => console.log('getting downloadURL of image error => ', e));
  };

  // Kayitli ise vt den, kayit yoksa google dan bilgileri alir.
  const retrieveData = async (user: Object, usersCollection: any, data: any, userInfo: any) => {
    let userTemp;
    try {
      const { _data, exists } = usersCollection;
      if (exists) {
        userTemp = {
          id: _data.id,
          email: _data.email,
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
        userTemp = {
          id: userInfo.user.id,
          email: userInfo.user.email,
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
        
        // console.log('login', profile)
        // firestore()
        //   .collection('Users')
        //   .doc(userInfo.user.email)
        //   .set(profile)
        //   .then(() => {
        //     console.log('User added!');
        //   });
      }

      if (userTemp.photo == null) {
        getImage()
      }

      storeData('Users', userTemp);
      setUser(userTemp);

      if (userTemp.age == null) {
        navigation.navigate('Create Profile', {from: 'Login'})
      }
      else {
        navigation.goBack()
      }

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
