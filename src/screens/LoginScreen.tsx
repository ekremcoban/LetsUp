import React, {useContext} from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getData, storeData } from '../db/localDb';
import ContextApi from 'context/ContextApi';

const LoginScreen = ({navigation}: any) => {
    const {profile, setProfile} = useContext(ContextApi);

    const signIn = async (navigation: any) => {
        GoogleSignin.configure({
            webClientId: '302760440961-vou3ifko88vp0cfun6cd3othj2bllf4m.apps.googleusercontent.com',
          });
    
          try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log('google', userInfo.user);
            const profile = {
                id: userInfo.user.id,
                name: userInfo.user.givenName,
                surname: userInfo.user.familyName,
                email: userInfo.user.email,
                photo: userInfo.user.photo
            }
            
            storeData('profile', profile).then(res =>{
                setProfile(profile);
                navigation.goBack();
            })
          }
          catch (error) {
              console.error(error)
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
        <Text style={{ fontSize: 20 }}>
          Login With Google
        </Text>
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
