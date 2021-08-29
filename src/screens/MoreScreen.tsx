import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
const pkg = require('../../package.json');

const MoreScreen = () => {
    const navigation = useNavigation();
  return (
    <>
      <View style={{ flex: 1 }}>
        <Image
          source={require('../assets/images/more/letsup.png')}
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.viewContainer}
          onPress={() => navigation.navigate('Feedback')}
        >
          <View style={styles.viewLeft}>
            <MaterialIcon size={30} name="feedback" color='gray' />
          </View>
          <View style={styles.viewRight}>
            <Text style={styles.textBold}>Feedback</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewContainer}
          onPress={() => navigation.navigate('How To Use')}
        >
          <View style={styles.viewLeft}>
          <MaterialIcon size={30} name="lightbulb" color='gray' />
          </View>
          <View style={styles.viewRight}>
            <Text style={styles.textBold}>How To Use</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewContainer}
          onPress={() => navigation.navigate('What Is Lets Up')}
        >
          <View style={styles.viewLeft}>
          <MaterialIcon size={30} name="help" color='gray' />
          </View>
          <View style={styles.viewRight}>
            <Text style={styles.textBold}>What's Is Let's Up?</Text>
          </View>
          </TouchableOpacity>

        <Text style={{ textAlign: 'center' }}>{pkg.version}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#CCC',
  },
  viewLeft: {
    flex: 1,
    padding: 20,
    // backgroundColor: 'red',
  },
  icon: {
    width: 60,
    height: 60,
  },
  viewRight: {
    flex: 5,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    // backgroundColor: 'red',
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textDate: {
    paddingTop: 3,
    fontSize: 12,
    color: '#515151',
  },
});

export default MoreScreen;
