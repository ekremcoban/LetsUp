import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

const spinnerTemplete = () => (
    <View style={styles.spinnerView}>
      <ActivityIndicator size="large" color={'#37CC4A'} />
    </View>
  );

  export default spinnerTemplete;

const styles = StyleSheet.create({
    spinnerView: {
      zIndex: 1,
      height: '100%',
      width: '100%',
      backgroundColor: 'transparent',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
})