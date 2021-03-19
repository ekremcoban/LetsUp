import React, { Component } from 'react';
import {
  StyleSheet, View, Text, TouchableNativeFeedback,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { window } from '../utilities/constants/globalValues';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = window;

class ActionSheetMenu extends Component {
  showActionSheet = () => {
    this.ActionSheet.show()
  }
  render() {
    return (
      <>
        <Text style={{ fontWeight: 'bold', paddingBottom: 7 }}>Activity Name*</Text>
        <TouchableNativeFeedback >
          <View style={{
            height: height * 0.05, borderWidth: 1,
            borderRadius: 10, backgroundColor: 'white', justifyContent: 'center'
          }}>
            <Ionicons size={25} name="caret-down"
              style={{ alignSelf: 'flex-end' }}
            />
            <ActionSheet
              ref={o => this.ActionSheet = o}
              title={this.props.title}
              options={this.props.items}
              cancelButtonIndex={2}
              destructiveButtonIndex={1}
              onPress={(index) => { this.props.onPress() }}
            />
          </View>

        </TouchableNativeFeedback>
      </>
    )
  }
}

export default ActionSheetMenu;