import React, {useState} from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

const UsageTipsScreen = () => {
    const [whichTab, setWhichTab] = useState<number>(0);

    return (
        <>
        <View style={styles.viewTitle}>
          <TouchableOpacity
            style={whichTab === 0 ? styles.viewTitleCol1 : [styles.viewTitleCol1, {borderBottomWidth: 0, }]}
            onPress={() => setWhichTab(0)}
          >
            <Text style={whichTab === 0 ? styles.textCol1 : [styles.textCol1, {color: 'gray'}]}>Create Activity</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={whichTab === 1 ? styles.viewTitleCol2 : [styles.viewTitleCol2, {borderBottomWidth: 0, }]}
            onPress={() => setWhichTab(1)}
          >
            <Text  style={whichTab === 1 ? styles.textCol1 : [styles.textCol1, {color: 'gray'}]}>Join Activity</Text>
          </TouchableOpacity>
        </View>
         <ScrollView>
        <View style={{alignItems: 'center', backgroundColor: 'white'}}>
        {whichTab === 0 
        ? <Image
              source={require('../assets/images/more/create_activity.png')}
              style={{width: window.width, height: 1500, resizeMode: 'contain'}}
            />
        :
        <Image
              source={require('../assets/images/more/join_activity.png')}
              style={{width: window.width, height: 1200, resizeMode: 'contain'}}
            />
        }
        </View>
        </ScrollView>
</>
    )
}

const styles = StyleSheet.create({
    viewTitle: {
        height: 80,
        backgroundColor: 'white',
        flexDirection: 'row',
      },
  viewTitleCol1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: '#37CC4A',
  },
  textCol1: {
    color: '#37CC4A',
    fontWeight: 'bold',
  },
  viewTitleCol2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: '#37CC4A',
  },
})

export default UsageTipsScreen;