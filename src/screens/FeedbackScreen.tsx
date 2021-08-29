import React, { useState, createRef } from 'react';
import { StyleSheet, View, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Selector } from 'components/selector/selector';
import { activityNames, getSelectedActivityName } from 'models/activity-names';
import { IActionSheet } from 'components/action-sheet/action-sheet';
import { ActivityNameActionSheet } from '../screens/create-activity/action-sheets/activity-name.action-sheet';
import { TextInput } from 'react-native-gesture-handler';
import { onChange } from 'react-native-reanimated';
import { colors } from 'styles/colors';
import CustomButton from 'components/buttons/customButton';
import { v4 as uuidv4 } from 'uuid';
import firestore from '@react-native-firebase/firestore';
import { useContext } from 'react';
import ContextApi from 'context/ContextApi';
import DisplaySpinner from '../components/spinner';
import { useNavigation } from '@react-navigation/native';

const activityNameActionSheetRef = createRef<IActionSheet>();

const FeedbackScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(ContextApi);
  const [spinner, setSpinner] = useState<boolean>(false);
  const [warning, setWarning] = useState(false);
  const [changeText, onChangeText] = React.useState('');
  const [selectedActivityNameValue, setSelectedActivityNameValue] = useState<
    number | null
  >(null);

  const sendingAlert = () => {
    Alert.alert('Warning', 'Are you sure?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          sendFeedback();
        },
      },
    ]);
  };

  const sendFeedback = () => {
    setSpinner(true);
    const feedback = {
      id: uuidv4(),
      title: polyglot.t(
        activityNames.filter((a) => a.value === selectedActivityNameValue)[0]
          .text
      ),
      content: changeText,
      user: user,
      date: new Date(),
    };

    firestore()
      .collection('Feedback')
      .doc(feedback.id)
      .set(feedback)
      .then((result) => {
        Alert.alert('Success', 'Your feedback was sent.', [
            {
              text: 'Ok',
              onPress: () => navigation.navigate('Activity List'),
              style: 'cancel',
            }
        ]);
        setSpinner(false);
      })
      .catch((error) => {
        Alert.alert('Failed', 'Something was wrong!');
        setSpinner(false);
      });
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{flex: 1}}
  >
      {spinner && <DisplaySpinner />}
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Selector
          warning={warning}
          onPress={() => {
            activityNameActionSheetRef.current?.open();
          }}
          label={`Feedback Type`}
          text={(() => {
            const selectedActivityName = getSelectedActivityName(
              selectedActivityNameValue,
              'feedback'
            );
            if (!selectedActivityName) {
              return undefined;
            }
            return polyglot.t(selectedActivityName.text);
          })()}
        />
        <ActivityNameActionSheet
          title={'Feedback Type'}
          branchName={'feedback'}
          ref={activityNameActionSheetRef}
          onSelect={(activityNameValue: number) => {
            setWarning(false);
            setSelectedActivityNameValue(activityNameValue);
            activityNameActionSheetRef.current?.close();
          }}
          onCancel={() => {
            activityNameActionSheetRef.current?.close();
          }}
        />
      </View>
      <View style={{ flex: 5, justifyContent: 'flex-start', paddingTop: '5%' }}>
        <Text
          style={{
            fontWeight: '500',
            fontSize: 16,
            color: colors.mortar,
            paddingBottom: 2,
          }}
        >
          Content
        </Text>
        <TextInput
          style={{ height: '25%', backgroundColor: 'white' }}
          onChangeText={onChangeText}
          value={onChange}
          multiline={true}
        />
        <View style={{ paddingTop: 20, alignItems: 'center' }}>
          <CustomButton onPress={() => sendingAlert()} title="Send" />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default FeedbackScreen;
