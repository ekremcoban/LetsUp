import React, { useContext } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getData, storeData } from '../db/localDb';
import ContextApi from 'context/ContextApi';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = ({ navigation }: any) => {
  const { profile, setProfile } = useContext(ContextApi);

  const signIn = async (navigation: any) => {
    GoogleSignin.configure({
      webClientId:
        '302760440961-62l3brhdrhu0372cobb5ted76gtk43pe.apps.googleusercontent.com',
    });

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      console.log('google', userInfo.user);
      let profile : Object = {};
      // let profile = {
      //   id: userInfo.user.id,
      //   name: userInfo.user.givenName,
      //   surname: userInfo.user.familyName,
      //   photo: userInfo.user.photo,
      // };

      const usersCollection = await (await firestore().collection('Test').doc('resulekremcoban@gmail.com').get());
      if (usersCollection.exists) {
        const { _data } = usersCollection;
        profile = {
          id: _data.id,
          name: _data.name,
          surname: _data.surname,
          photo: _data.photo,
          age: _data.age,
          height: _data.height,
          interestedIn: _data.interestedIn,
          weight: _data.weight,
        }
      }
      else {
        profile = {
            id: userInfo.user.id,
            name: userInfo.user.givenName,
            surname: userInfo.user.familyName,
            photo: userInfo.user.photo,
          };
      }

      console.log('from server', profile);

      // firestore()
      //   .collection('Test')
      //   .doc(userInfo.user.email)
      //   .set(profile)
      //   .then(() => {
      //     console.log('User added!');
      //   });

      storeData('profile', profile).then((res) => {
        setProfile(profile);
        navigation.goBack();
      });
    } catch (error) {
      console.error(error);
    }
  };

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
