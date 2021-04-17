import React, { Component, useState, } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { renderers } from 'react-native-popup-menu';
import { WebView } from 'react-native-webview';
import html_script from '../../html_leaflet';

class ProfilScreen extends Component {

  componentDidMount() {
    setTimeout(() => {
      console.log('timer')
      this.refs['mapRef'].injectJavaScript(`
    L.Routing.control({
      show: false,
      waypoints: [
        L.latLng(41.01809926611338, 29.00856835843875),
        L.latLng(40.88688641127476, 29.186640955537502),
        L.latLng(40.81831905125059, 29.285431003343092),
        L.latLng(40.81191220859712, 29.365444423703714)
      ]
    }).addTo(mymap);
    
    `)
    }, 1500);
  }


  goToPosition = (latitude, longitude,) => {
    this.refs['mapRef'].injectJavaScript(`
    L.marker([41.01809926611338, 29.00856835843875]).addTo(mymap)
    .bindPopup('Start Point')
    .openPopup();
    
    `)
  }

  render() {
    return (
      <>
        <Text>Profil Sayfası Test</Text>
        <WebView ref={'mapRef'} source={{ html: html_script }} style={{ width: '100%', }} />
        <View style={styles.ButtonArea}>
          <TouchableOpacity style={styles.Button} onPress={() => this.goToPosition(40.927598, 29.145154)}>
            <Text style={styles.ButtonText}>Belgrade</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Button} onPress={() => this.goToPosition(40.927278, 29.142592)}>
            <Text style={styles.ButtonText}>Madrid</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.Button} onPress={() => this.goToPosition(54.464180, -110.182259)}>
            <Text style={styles.ButtonText}>Madrid</Text>
          </TouchableOpacity> */}
        </View>
        {/* <WebView source={{ uri: 'https://reactnative.dev/' }} /> */}
      </>
    )
  }

}

export default ProfilScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'grey'

  },
  Webview: {
    flex: 2,

  },
  ButtonArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  Button: {
    width: 80,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'black',
    alignItems: 'center'
  },
  ButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  }
});