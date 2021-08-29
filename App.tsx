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
import OwnerOldActivityInfoScreen from 'screens/OwnerOldActivityInfoScreen';
import MemberOldActivityInfoScreen from 'screens/MemberOldActivityInfoScreen';
import MoreScreen from 'screens/MoreScreen';
import LoginScreen from 'screens/LoginScreen';
import ContextApi from 'context/ContextApi';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getData, removeItem, storeData } from 'db/localDb';
import { convertLowerString } from 'components/functions/common';
import messaging from '@react-native-firebase/messaging';
import MemberInfoScreen from 'screens/MemberInfoScreen';
import OwnerInfoScreen from 'screens/OwnerInfoScreen';
import FeedbackScreen from 'screens/FeedbackScreen';
import HowToUseScreen from 'screens/HowToUse';
import WhatIsLetsUpScreen from 'screens/WhatIsLetsUpScreen';
import { Badge } from 'react-native-elements';

let App = () => {
  const [user, setUser] = useState();
  const [userPhoto, setUserPhoto] = useState();
  const [location, setLocation] = useState();
  const [isCreateActivity, setIsCreateActivity] = useState();
  const [suspendActivity, setSuspendActivity] = useState();
  const [isSameCity, setIsSameCity] = useState();
  const [newNotifications, setNewNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const value = {
    user,
    setUser,
    userPhoto,
    setUserPhoto,
    location,
    setLocation,
    isCreateActivity,
    setIsCreateActivity,
    suspendActivity,
    setSuspendActivity,
    isSameCity,
    setIsSameCity,
    newNotifications,
    setNewNotifications,
    notifications,
    setNotifications
  };

  const scheme = useColorScheme();
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  useEffect(() => {
    CodePush.sync();
    requestUserPermission();
    subscribeToTopic();
    getNotifications();

    const subscriber1 = getData('myLocation').then((myLocation) => {
      console.log('muy', myLocation);
      if (myLocation == null) {
        getLocations().then((getLocation) => {
          console.log('getLocation 0', getLocation.city);
          console.log('Şehir YOHafızadaK');
          setLocation(getLocation);
          storeData('myLocation', getLocation);
        });
      } else {
        console.log('myLocation 0', myLocation.city);
        setLocation(myLocation);
        //  storeData('myLocation', {city: 'Malatya'});

        getLocations().then((getLocation) => {
          console.log('getLocation 1', getLocation.city);
          console.log('myLocation 1', myLocation.city);
          if (
            convertLowerString(myLocation.city) !==
            convertLowerString(getLocation.city)
          ) {
            setLocation(getLocation);
            storeData('myLocation', getLocation);
            console.log('Şehir değişti');
          }
        });
      }
    });

    const subscriber2 = getData('Users').then((res) => {
      if (res != null) {
        console.log('user app.tsx', res);
        setUser(res);
        if (res.photo == null) {
          getData('Photo').then((res) => {
            setUserPhoto(res);
            console.log('Photo', res);
          });
        }
      }
    });

    // const subscriber3 = messaging().onMessage(async (remoteMessage) => {
    //   console.log(remoteMessage);
    //   setNewNotifications(prevCount => prevCount + 1);
    //   // Alert.alert(
    //   //   remoteMessage.notification.title,
    //   //   remoteMessage.notification.body
    //   // );
    // });

    return {
      subscriber1,
      subscriber2,
      // subscriber3,
    };
  }, []);

  const subscribeToTopic = async () => {
    await messaging().subscribeToTopic('memberNotifications');
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken();
      // console.log('Authorization status:', authStatus);
    }
  };

  const getNotifications = async () => {
    let newNotificationArray = [];
    let notificationArray = [];

    const userInfo = await getData('Users');

    console.log('no', userInfo)
    if (userInfo != undefined) {
      firestore()
        .collection('Notifications')
        .where('toWho', '==', userInfo.email)
        .where('state', '==', true)
        .onSnapshot((noti) => {
          newNotificationArray = [];
          notificationArray = [];
          noti.docs.forEach((item) => {
            notificationArray.push(item.data());
            if (!item.data().isRead) {
              newNotificationArray.push(item.data());
            }
          });
          console.log('BURDAAAAA 1', newNotificationArray)
          console.log('BURDAAAAA 2', notificationArray)
          console.log('BURDAAAAA 3', newNotificationArray.length)
          setNewNotifications(newNotificationArray.length);
          setNotifications([...notificationArray]);
        });
    }
    else {
      setNewNotifications(0);
    }
  };

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      //  console.log(fcmToken);
      //  console.log("Your Firebase Token is:", fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  const getLocations = async () => {
    let location = await getLocationFromIp('https://ipapi.co/json/');
    console.log('location', location);
    if (location == undefined || location == null || location.error) {
      location = await getLocationFromIp('https://freegeoip.app/json/');
      console.log('ipapi', location);
      if (location == undefined || location == null || location.error) {
        console.log('google lazım');
      }
    }
    return location;
  };

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
        source={{
          uri:
            photo != null
              ? photo
              : user != null && user.photo != null
              ? user.photo
              : '',
        }}
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
    setUserPhoto(null);
    setNotifications([]);
    setNewNotifications(0);
    removeItem('Photo');
    removeItem('Users');
    GoogleSignin.signOut();
    GoogleSignin.revokeAccess();
    navigation.navigate('Activity List');
  };

  const exit = (navigation: any) => (
    <TouchableOpacity onPress={() => exitAccount(navigation)}>
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
              tabBarLabel: '',
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
                <>
                  {newNotifications > 0 && <Badge
                    value={newNotifications}
                    status="success"
                    containerStyle={{
                      position: 'absolute',
                      top: 0,
                      right: '25%',
                    }}
                  />}
                  <Ionicons name={'notifications'} size={25} color={color} />
                </>
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
              />
              <Stack.Screen
                name="Activity Info"
                component={ActivityInfoScreen}
                options={{
                  title: 'Activity Info',
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
                name="Owner Old Activity Info"
                component={OwnerOldActivityInfoScreen}
                options={{
                  title: 'Activity Feedback',
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
                name="Member Old Activity Info"
                component={MemberOldActivityInfoScreen}
                options={{
                  title: 'Activity Feedback',
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
                name="Member Info"
                component={MemberInfoScreen}
                options={({ navigation, route }) => ({
                  title: 'Profil',
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
                name="Owner Info"
                component={OwnerInfoScreen}
                options={({ navigation, route }) => ({
                  title: 'Profil',
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
              <Stack.Screen
                name="Feedback"
                component={FeedbackScreen}
                options={{
                  title: 'Feedback',
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
                name="How To Use"
                component={HowToUseScreen}
                options={{
                  title: 'How To Use',
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
                name="What Is Lets Up"
                component={WhatIsLetsUpScreen}
                options={{
                  title: 'What Is Let\'s Up',
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
