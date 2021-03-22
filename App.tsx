import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  useColorScheme,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CodePush from 'react-native-code-push';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import EventScreen from './src/screens/EventScreen';
import CreateActivityScreen from './src/screens/CreateActivityScreen';
import { colors } from './src/utilities/constants/globalValues';
import { ActivityListScreen } from 'screens/activity-list/activity-list.screen';
import { InitializeSettings } from 'components/initialize-settings/initialize-settings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfilScreen from 'screens/ProfilScreen';
import MyActivitiesScreen from 'screens/MyActivitiesScreen';
import NotificationScreen from 'screens/NotificationScreen';

let App = () => {
  const [userId, setUserId] = useState('DmwlR3OcI72ouDxUPH79');
  const scheme = useColorScheme();

  useEffect(() => {
    CodePush.sync();
    // auth()
    //   .createUserWithEmailAndPassword('osman@example.com', 'SuperSecretPassword!')
    //   .then(x => {
    //     console.log('x', x)
    //     console.log('user', auth().currentUser)
    //     console.log('User account created & signed in!');
    //   })
    //   .catch(error => {
    //     if (error.code === 'auth/email-already-in-use') {
    //       // console.log('That email address is already in use!', error);
    //       // console.log('user1', auth().currentUser)
    //     }

    //     if (error.code === 'auth/invalid-email') {
    //       console.log('That email address is invalid!', error);
    //     }

    //     console.error(error);
    //   });

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

  const Home = () => {
    return (
      <SafeAreaProvider>
        <Tab.Navigator
          initialRouteName={'Activity List'}
        >
          <Tab.Screen name="Activity List" component={ActivityListScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={'home-outline'} size={25} color={colors.bar} />
              ),
            }}
          />
          <Tab.Screen name="Profil" component={ProfilScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={'person-outline'} size={25} color={colors.bar} />
              ),
            }}
          />
           <Tab.Screen name="Create Activity" component={CreateActivityScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={'add-circle-outline'} size={25} color={colors.bar} />
              ),
            }}
          />
          <Tab.Screen name="My Activities" component={MyActivitiesScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={'heart-outline'} size={25} color={colors.bar} />
              ),
            }}
          />
          <Tab.Screen name="Notification" component={NotificationScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={'notifications-outline'} size={25} color={colors.bar} />
              ),
              
            }}
          />
        </Tab.Navigator>
      </SafeAreaProvider>
    );
  }

  return (
    <InitializeSettings>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                title: 'Activity List',
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
