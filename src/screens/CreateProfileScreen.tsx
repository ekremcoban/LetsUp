import React, { Component, useState, createRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Selector } from 'components/selector/selector';
import { IActionSheet } from '../components/action-sheet/action-sheet';
import { getSelectedGender } from 'models/genders';
import ActionSheetMenu from '../components/actionSheetMenu';
import { GenderActionSheet } from './create-activity/action-sheets/gender.action-sheet';
import { AgeActionSheet } from './create-activity/action-sheets/age.action-sheet';

const genderActionSheetRef = createRef<IActionSheet>();
const ageActionSheetRef = createRef<IActionSheet>();

const CreateProfilScreen = () => {
  const [nickName, onChangeNickName] = React.useState("");
  const [fullName, onChangeFullName] = React.useState("");
  const [selectedGenderValue, setSelectedGenderValue] = useState<string | null>(
    null
  );
  const [selectedAge, setSelectedAge] = useState<number>();

  return (
    <>
      <View style={styles.viewImg}>
        <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
          <View style={styles.viewbuttonAction}>
            <Text style={styles.textButtonAction}>CREATE</Text>
          </View>
        </TouchableOpacity>
        <Image
          source={require('assets/img/userphoto.png')}
          style={styles.icon}
        />
      </View>
      <View style={styles.viewInfo}>
        <View style={styles.viewNickName}>
          <Text style={styles.textNickName}>Nickname*</Text>
          <View
            style={{
              height: 30,
              paddingLeft: 5,
              paddingRight: 5,
            }}
          >
            <TextInput
              style={styles.input}
              onChangeText={onChangeNickName}
              value={nickName}
            />
          </View>
        </View>

        <View style={styles.viewFullName}>
          <Text style={styles.textFullName}>Full Name*</Text>
          <View
            style={{
              height: 30,
              paddingLeft: 5,
              paddingRight: 5,
            }}
          >
            <TextInput
              style={styles.input}
              onChangeText={onChangeFullName}
              value={fullName}
            />
          </View>
        </View>

        <View style={styles.viewFeature1}>
          <View style={styles.viewAge}>
            <Selector
              onPress={() => ageActionSheetRef.current?.open()}
              label={polyglot.t(
                'screens.create_activity.inputs.age.label'
              )}
              text={selectedAge}
            />
          </View>
          <View style={styles.viewGender}>
            <Selector
              onPress={() => genderActionSheetRef.current?.open()}
              label={polyglot.t(
                'screens.create_activity.inputs.gender.label'
              )}
              text={(() => {
                const selectedGender = getSelectedGender(
                  selectedGenderValue
                );
                if (!selectedGender) {
                  return undefined;
                }
                return polyglot.t(selectedGender.text);
              })()}
            />
          </View>
        </View>

        <View style={styles.viewFeature2}>
          <View style={styles.viewAge}>
            <Selector
              onPress={() => genderActionSheetRef.current?.open()}
              label={polyglot.t(
                'screens.create_activity.inputs.gender.label'
              )}
              text={(() => {
                const selectedGender = getSelectedGender(
                  selectedGenderValue
                );
                if (!selectedGender) {
                  return undefined;
                }
                return polyglot.t(selectedGender.text);
              })()}
            />
          </View>
          <View style={styles.viewGender}>
            <Selector
              onPress={() => genderActionSheetRef.current?.open()}
              label={polyglot.t(
                'screens.create_activity.inputs.gender.label'
              )}
              text={(() => {
                const selectedGender = getSelectedGender(
                  selectedGenderValue
                );
                if (!selectedGender) {
                  return undefined;
                }
                return polyglot.t(selectedGender.text);
              })()}
            />
          </View>
        </View>

        <View style={styles.viewFeature3}>
          <ActionSheetMenu
            label={'Branch Name*'}
            title={'Select'}
            items={[
              'Jogging',
              'Basketball',
              'Bcycle',
              'Hiking',
              'Table Tennis',
              'Bowling',
              'Frisbee',
              'Cancel',
            ]}
            onPress={() => console.log('TEST')}
          />
        </View>
        <GenderActionSheet
          ref={genderActionSheetRef}
          onSelect={(genderValue: string) => {
            setSelectedGenderValue(genderValue);
            genderActionSheetRef.current?.close();
          }}
          onCancel={() => {
            genderActionSheetRef.current?.close();
          }}
        />
        <AgeActionSheet
          ref={ageActionSheetRef}
          onSelect={(number: number) => {
            // TODO: Validate selected age values
            setSelectedAge(number);
            ageActionSheetRef.current?.close();
          }}
          onCancel={() => {
            ageActionSheetRef.current?.close();
          }}
        />
      </View>
    </>
  )
}

export default CreateProfilScreen;

const styles = StyleSheet.create({
  viewImg: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewbuttonAction: {
    height: 40,
    width: 80,
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: '#37CC4A',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonAction: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    width: 100,
    height: 100,
  },

  viewInfo: {
    flex: 3,
    padding: 12,
    // backgroundColor: 'orange'
  },
  viewNickName: {
    flex: .7,
    // backgroundColor: 'red'
  },
  textNickName: {
    paddingStart: 5,
    fontWeight: 'bold'
  },
  input: {
    height: 40,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#DADADA',
    backgroundColor: 'white'
  },

  viewFullName: {
    flex: .6,
    // backgroundColor: 'yellow'
  },
  textFullName: {
    paddingStart: 5,
    fontWeight: 'bold'
  },

  viewFeature1: {
    flex: .6,
    paddingLeft: 5,
    paddingEnd: 5,
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: 'orange'
  },
  viewAge: {
    flex: 1,
    paddingRight: 5,
  },
  viewGender: {
    flex: 1,
    paddingLeft: 5,
  },

  viewFeature2: {
    flex: .7,
    paddingLeft: 5,
    paddingEnd: 5,
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: 'red'
  },

  viewFeature3: {
    flex: 1,
  },
});