import React, { Component } from 'react';
import {
  StyleSheet, View, Text, TouchableNativeFeedback,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { window } from '../utilities/constants/globalValues';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = window;

class ActionSheetMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {activityName: 'Please Select'}
  }
  
  press = (value: number) => {
    this.props.onPress(value.toString());

    if (value !== this.props.items.length - 1) {
      this.setState({ activityName: this.props.items[value]})
    }
  }

  render() {
    return (
      <>
        <Text style={{ fontWeight: 'bold', paddingBottom: 7, paddingLeft: 10 }}>{this.props.label}</Text>
        <TouchableNativeFeedback onPress={() => this.ActionSheet.show()}>
          <View style={{
            height: height * 0.06, borderWidth: 1, flexDirection: 'row', alignSelf: 'center',
            borderRadius: 10, backgroundColor: 'white', justifyContent: 'center', borderColor: '#CCC'
          }}>
            <View style={{ width: '90%', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{fontSize: width * 0.045,}}>{this.state.activityName}</Text>
            </View>
            <Ionicons size={25} name="caret-down"
              style={{ alignSelf: 'center', color: '#CCC' }}
            />
            <ActionSheet
              ref={o => this.ActionSheet = o}
              title={this.props.title}
              options={this.props.items}
              cancelButtonIndex={this.props.items.length}
              destructiveButtonIndex={this.props.items.length - 1}
              onPress={(index) => { this.press(index) }}
            />
          </View>

        </TouchableNativeFeedback>
      </>
    )
  }
}

export default ActionSheetMenu;