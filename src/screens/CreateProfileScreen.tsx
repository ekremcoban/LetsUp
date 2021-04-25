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
import { GenderActionSheet } from './create-activity/action-sheets/gender.action-sheet';
import { AgeActionSheet } from './create-activity/action-sheets/age.action-sheet';
import { HeightActionSheet } from './create-activity/action-sheets/height.action-sheet';
import { WeightActionSheet } from './create-activity/action-sheets/weight.action-sheet';
import { ActivityTypeSelector } from 'components/activity-type-selector/activity-type-selector';
import {
  activityTypes,
  IActivityType,
} from 'components/activity-type-selector/models';

const genderActionSheetRef = createRef<IActionSheet>();
const ageActionSheetRef = createRef<IActionSheet>();
const heightActionSheetRef = createRef<IActionSheet>();
const weightActionSheetRef = createRef<IActionSheet>();

const CreateProfilScreen = () => {
  const [fullName, onChangeFullName] = React.useState("");
  const [selectedGenderValue, setSelectedGenderValue] = useState<string | null>(
    null
  );
  const [selectedAge, setSelectedAge] = useState<number>();
  const [selectedHeight, setSelectedHeight] = useState<
    [number | null, number | null]
  >([null, null]);
  const [selectedWeight, setSelectedWeight] = useState<
    [number | null, number | null]
  >([null, null]);
  const [branchNo, setBranchNo] = useState<number | null>(null);

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
        <View style={styles.viewFullName}>
          <Text style={styles.textFullName}>
            {polyglot.t(
              'screens.create_profile.label.full_name'
            )}
          </Text>
          <View style={styles.inputFullName}>
            <TextInput
              style={styles.inputNameText}
              onChangeText={onChangeFullName}
              value={fullName}
            />
          </View>
        </View>

        <View style={styles.viewAgeGender}>
          <View style={styles.viewAge}>
            <Text style={styles.textAge}>
              {polyglot.t(
                'screens.create_profile.label.age'
              )}
            </Text>
            <Selector
              styleView={styles.selectorAge}
              onPress={() => ageActionSheetRef.current?.open()}
              // label={polyglot.t(
              //   'screens.create_profile.action_sheets.age.title'
              // )}
              text={selectedAge}
            />
          </View>
          <View style={styles.viewGender}>
            <Text style={styles.textGender}>
              {polyglot.t(
                'screens.create_profile.label.gender'
              )}
            </Text>
            <Selector
              styleView={styles.selectorGender}
              onPress={() => genderActionSheetRef.current?.open()}
              // label={polyglot.t(
              //   'screens.create_profile.action_sheets.gender.title'
              // )}
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

        <View style={styles.viewHeightWeight}>
          <View style={styles.viewHeight}>
            <Text style={styles.textHeight}>
              {polyglot.t(
                'screens.create_profile.label.height'
              )}
            </Text>
            <Selector
              styleView={styles.selectorHeight}
              onPress={() => heightActionSheetRef.current?.open()}
              // label={polyglot.t(
              //   'screens.create_profile.action_sheets.height.title'
              // )}
              text={selectedHeight[0] != null && selectedHeight[1] != null && `${selectedHeight[0]}.${selectedHeight[1]} m`}
            />
          </View>
          <View style={styles.viewWeight}>
            <Text style={styles.textWeight}>
              {polyglot.t(
                'screens.create_profile.label.weight'
              )}
            </Text>
            <Selector
              styleView={styles.selectorWeight}
              onPress={() => weightActionSheetRef.current?.open()}
              // label={polyglot.t(
              //   'screens.create_profile.action_sheets.weight.title'
              // )}
              text={selectedWeight[0] != null && selectedWeight[1] != null && `${selectedWeight[0]}.${selectedWeight[1]} kg`}
            />
          </View>
        </View>

        <View style={styles.viewInterestedIn}>
          <Text style={styles.textInterestedIn}>
            {polyglot.t(
              'screens.create_profile.label.interested_in'
            )}
          </Text>
          <ActivityTypeSelector>
            {activityTypes.map((activityType: IActivityType, index: number) => (
              <ActivityTypeSelector.IconItem
                key={activityType.id}
                id={activityType.id}
                icon={activityType.image}
                text={polyglot.t(activityType.textKey)}
                onItemPress={(selecteActivityTypes: number[]) =>
                  setBranchNo(selecteActivityTypes[0])
                }
              />
            ))}
          </ActivityTypeSelector>
        </View>
        <View style={{ flex: 1, }} />
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
        <HeightActionSheet
          ref={heightActionSheetRef}
          onSelect={([m, cm]: [number, number]) => {
            // TODO: Validate selected age values
            setSelectedHeight([m, cm]);
            heightActionSheetRef.current?.close();
          }}
          onCancel={() => {
            heightActionSheetRef.current?.close();
          }}
        />
        <WeightActionSheet
          ref={weightActionSheetRef}
          onSelect={([kg, gr]: [number, number]) => {
            // TODO: Validate selected age values
            setSelectedWeight([kg, gr]);
            weightActionSheetRef.current?.close();
          }}
          onCancel={() => {
            weightActionSheetRef.current?.close();
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
  inputNameText: {
    height: 40,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    paddingTop: 10,
    borderColor: '#DADADA',
    backgroundColor: 'white'
  },

  viewFullName: {
    flex: 1,
    // backgroundColor: 'yellow'
  },
  textFullName: {
    paddingStart: 5,
    fontWeight: 'bold',
  },
  inputFullName: {
    height: 30,
    paddingLeft: 5,
    paddingRight: 5,
  },

  viewAgeGender: {
    flex: 1,
    marginTop: 5,
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
  textAge: {
    paddingStart: 5,
    fontWeight: 'bold',
  },
  selectorAge: {
    height: 40,
    marginTop: 5,
  },
  viewGender: {
    flex: 1,
    paddingLeft: 5,
  },
  textGender: {
    paddingStart: 5,
    fontWeight: 'bold',
  },
  selectorGender: {
    height: 40,
    marginTop: 5,
  },

  viewHeightWeight: {
    flex: 1,
    marginTop: 5,
    paddingLeft: 5,
    paddingEnd: 5,
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: 'red'
  },
  viewHeight: {
    flex: 1,
    paddingRight: 5,
  },
  textHeight: {
    paddingStart: 5,
    fontWeight: 'bold',
  },
  selectorHeight: {
    height: 40,
    marginTop: 5,
  },
  viewWeight: {
    flex: 1,
    paddingStart: 5,
  },
  textWeight: {
    paddingStart: 5,
    fontWeight: 'bold',
  },
  selectorWeight: {
    height: 40,
    marginTop: 5,
  },

  viewInterestedIn: {
    flex: 2,
    marginTop: 5,
    paddingLeft: 5,
    paddingEnd: 5,
    // backgroundColor: 'orange'
  },
  textInterestedIn: {
    paddingStart: 5,
    fontWeight: 'bold',
  }
});