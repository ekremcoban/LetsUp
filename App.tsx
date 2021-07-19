import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CodePush from 'react-native-code-push';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CreateActivityScreen from './src/screens/create-activity/create-activity.screen';
import { colors } from './src/utilities/constants/globalValues';
import { ActivityListScreen } from 'screens/activity-list/activity-list.screen';
import { InitializeSettings } from 'components/initialize-settings/initialize-settings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CreateProfileScreen from 'screens/CreateProfileScreen';
import ProfileInfoScreen from 'screens/ProfileInfoScreen';
import MyActivitiesScreen from 'screens/MyActivitiesScreen';
import NotificationScreen from 'screens/NotificationScreen';
import ActivityInfoScreen from 'screens/ActivityInfoScreen';
import MoreScreen from 'screens/MoreScreen';
import LoginScreen from 'screens/LoginScreen';
import ContextApi from 'context/ContextApi';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getData, removeItem } from 'db/localDb';

let App = () => {
  const [user, setUser,] = useState();
  const [userPhoto, setUserPhoto] = useState();
  const [location, setLocation] = useState();
  const value = { user, setUser, userPhoto, setUserPhoto, location, setLocation };

  const scheme = useColorScheme();
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  useEffect(() => {
    CodePush.sync();
    
    getLocations();

    getData('Users').then(res => {
      console.log('user', res.photo)
      setUser(res)
      if (res.photo == null) {
        getData('Photo').then(res => {
          setUserPhoto(res)
          console.log('Photo', res)
        })
      }
  });
    // auth()
    //   .createUserWithEmailAndPassword(
    //     'osman@example.com',
    //     'SuperSecretPassword!'
    //   )
    //   .then((x) => {
    //     console.log('x', x);
    //     console.log('user', auth().currentUser);
    //     console.log('User account created & signed in!');
    //   })
    //   .catch((error) => {
    //     if (error.code === 'auth/email-already-in-use') {
    //       // console.log('That email address is already in use!', error);
    //       // console.log('user1', auth().currentUser)
    //     }

    //     if (error.code === 'auth/invalid-email') {
    //       console.log('That email address is invalid!', error);
    //     }

    //     console.error(error);
    // });

    // auth().signInWithEmailAndPassword('osmana@example.com', 'SuperSecretPassword!')
    //   .then((userCredential) => {
    //     // Signed in
    //     var user = userCredential.user;
    //     console.log('user2', user)
    //     // ...
    //   })
    //   .catch((error) => {
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     console.log('user2', errorMessage)
    //   });
    //   const subscriber = firestore()
    //     .collection('Test')
    //     .doc(userId)
    //     .onSnapshot(documentSnapshot => {
    //       console.log('User data: ', documentSnapshot.data());
    //     });

    //   // Stop listening for updates when no longer required
    //   return () => subscriber();
  }, []);

  const getLocations = async () => {
    let location = await getLocationFromIp('https://ipapi.co/json/');
    console.log('location', location)
    if (location == undefined || location == null || location.error) {
      location = await getLocationFromIp('http://api.ipstack.com/217.138.197.90?access_key=84ce184e1841433c0e8ca4070334a724');
      console.log('ipstack', location)
    }
    setLocation(location)
}

const getLocationFromIp = (url: string) => {
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error('ipapi', error);
      });
  };

  const logOutTitle = (navigation: any, user: any, photo: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('Profile Info')}>
      <Image
        source={{uri: user != null && user.photo != null ? user.photo : photo}}
        style={{ width: 25, height: 25, borderRadius: 20 }}
      />
    </TouchableOpacity>
  );

  const loginInTitle = (navigation: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
      <Ionicons name={'log-in-outline'} size={30} color={'white'} />
    </TouchableOpacity>
  );

  const exitAccount = (navigation: any) => {
    setUser(null);
    removeItem('Photo')
    removeItem('Users')
    GoogleSignin.signOut();
    GoogleSignin.revokeAccess();
    navigation.navigate('Activity List')
  };

  const exit = (navigation: any) => (
    <TouchableOpacity
    onPress={() => exitAccount(navigation)}
    >
      <Ionicons name={'log-out-outline'} size={25} color={'white'} />
    </TouchableOpacity>
  );

  const Home = () => {
    return (
      <SafeAreaProvider>
        <Tab.Navigator
          initialRouteName={'Activity List'}
          tabBarOptions={{
            activeTintColor: colors.bar,
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen
            name="Activity List"
            component={ActivityListScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={'home'} size={25} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="My Activities"
            component={MyActivitiesScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={'star'} size={25} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Create Activity"
            component={CreateActivityScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <View
                  style={{
                    flex: 1,
                    position: 'absolute',
                    bottom: 0, // space from bottombar
                    height: 60,
                    width: 60,
                    borderRadius: 55,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                  }}
                >
                  <Ionicons
                    name={'add-circle'}
                    size={65}
                    color={color}
                    style={{ bottom: 5 }}
                  />
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="Notification"
            component={NotificationScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={'notifications'} size={25} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="More"
            component={MoreScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={'menu-outline'} size={25} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </SafeAreaProvider>
    );
  };

  return (
    <ContextApi.Provider value={value}>
      <InitializeSettings>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Home"
                component={Home}
                options={({ navigation, route }) => ({
                  title: 'Lets Up',
                  headerStyle: {
                    backgroundColor: colors.bar,
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    paddingStart: Platform.OS == 'android' ? '20%' : 0,
                  },
                  headerRight: () => (
                    <View style={{ flexDirection: 'row', margin: 5 }}>
                      {user == null
                        ? loginInTitle(navigation)
                        : logOutTitle(navigation, user, userPhoto)} 
                    </View>
                  ),
                })}
                // options={{
                //   title: 'Lets Up',
                //   headerStyle: {
                //     backgroundColor: colors.bar,
                //   },
                //   headerTintColor: '#fff',
                //   headerTitleStyle: {
                //     fontWeight: 'bold',
                //   },
                //   headerRight: (navigation) => (
                //     <View style={{ flexDirection: 'row', margin: 10 }}>
                //       {loginTitle(navigation)}
                //     </View>
                //   ),
                // }}
              />
              <Stack.Screen
                name="Activity"
                component={ActivityInfoScreen}
                options={{
                  title: 'Activity',
                  headerStyle: {
                    backgroundColor: colors.bar,
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              />
              <Stack.Screen
                name="Profile Info"
                component={ProfileInfoScreen}
                options={({ navigation, route }) => ({
                  title: 'Profile Info',
                  headerStyle: {
                    backgroundColor: colors.bar,
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerRight: () => (
                    <View style={{ flexDirection: 'row', margin: 10 }}>
                      {exit(navigation)}
                    </View>
                  ),
                })}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  title: 'Login',
                  headerStyle: {
                    backgroundColor: colors.bar,
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              />
              <Stack.Screen
                name="Create Profile"
                component={CreateProfileScreen}
                options={{
                  title: 'Create Profile',
                  headerStyle: {
                    backgroundColor: colors.bar,
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </InitializeSettings>
    </ContextApi.Provider>
  );
};

const styles = StyleSheet.create({});

let codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  installMode: CodePush.InstallMode.IMMEDIATE,
};

App = CodePush(codePushOptions)(App);

export default App;
