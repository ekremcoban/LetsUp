import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  Image
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

let App = () => {
  const [userId, setUserId] = useState('DmwlR3OcI72ouDxUPH79');
  const scheme = useColorScheme();

  useEffect(() => {
    CodePush.sync();
    auth()
      .createUserWithEmailAndPassword('osman@example.com', 'SuperSecretPassword!')
      .then(x => {
        console.log('x', x)
        console.log('user', auth().currentUser)
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          // console.log('That email address is already in use!', error);
          // console.log('user1', auth().currentUser)
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!', error);
        }

        console.error(error);
      });

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

  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const loginTitle = (navigation) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Profile Info')}
    >
      <Image
        source={require('assets/images/activities/profile.png')}
        style={{ width: 25, height: 25, borderRadius: 20, }}
      />
    </TouchableOpacity>
  )

  const exit = (navigation) => (
    <TouchableOpacity
      // onPress={() => navigation.navigate('Profile Info')}
    >
      <Ionicons name={'log-out-outline'} size={25} color={'white'}/>
    </TouchableOpacity>
  )

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
                },
                headerRight: () => (
                  <View style={{ flexDirection: 'row', margin: 10 }}>
                    {loginTitle(navigation)}
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
  );
};

const styles = StyleSheet.create({});

let codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  installMode: CodePush.InstallMode.IMMEDIATE,
};

App = CodePush(codePushOptions)(App);

export default App;
