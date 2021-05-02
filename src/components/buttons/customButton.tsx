import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const customButton = ({ onPress, title, styleView, styleText } : Props) => (
    <TouchableOpacity onPress={onPress} style={[styles.container, styleView]}>
      <Text style={[styles.appButtonText, styleText]}>{title}</Text>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    appButtonText: {
      fontSize: 18,
      color: "#37CC4A",
    }
  });

  type Props = {
      onPress: any,
      title: string,
  }

  export default customButton;