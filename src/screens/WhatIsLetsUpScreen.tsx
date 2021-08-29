import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const WhoAreWeScreen = () => {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
      <Text style={{ fontWeight: 'bold' }}>What is Let’s Up and how it works?</Text>
      <Text>Let's Up is an application where you can find your teammate or opponent in a short time by creating the sports activity you want, wherever you want, or participate in different sports activities that will your interest.</Text>
      <Text style={{ fontWeight: 'bold', marginTop: 15 }}>Profile</Text>
      <Text>In order to create an activity on the Let's Up platform, you need to register with your Google account and create a profile.</Text>
      <Text style={{ fontWeight: 'bold', marginTop: 15 }}>Join to activities</Text>
      <Text>You can choose the one that suits you from the activities you will see on the homepage and send a participation request. You can participate in the event with the approval of the activity owner.</Text>
      <Text style={{ fontWeight: 'bold', marginTop: 15 }}>Contact</Text>
      <Text>If you are accepted to the activity, you can contact the activity owner via your e-mail account.</Text>
      <Text style={{ fontWeight: 'bold', marginTop: 15 }}>Leaving the activities</Text>
      <Text>You can leave before the activity you joined takes place. In this case your score affects negatively.</Text>
      <Text style={{ fontWeight: 'bold', marginTop: 15 }}>Scoring</Text>
      <Text>After the activity is over, you are rated by other participants.</Text>
    </View>
  );
};

export default WhoAreWeScreen;
