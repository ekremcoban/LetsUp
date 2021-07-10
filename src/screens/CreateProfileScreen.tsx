import React, { Component, useState, createRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Platform,
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
import firestore from '@react-native-firebase/firestore';
import { useEffect } from 'react';
import { getData, storeData } from 'db/localDb';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePickerCropper from 'react-native-image-crop-picker';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';

const genderActionSheetRef = createRef<IActionSheet>();
const ageActionSheetRef = createRef<IActionSheet>();
const heightActionSheetRef = createRef<IActionSheet>();
const weightActionSheetRef = createRef<IActionSheet>();

const CreateProfilScreen = () => {
  const [users, setUsers] = React.useState();
  const [email, setEmail] = React.useState();
  const [photo, setPhoto] = React.useState();
  const [fullName, onChangeFullName] = React.useState('');
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
  const [uploadUri, setUploadUri] = useState();
  const [imageName, setImageName] = useState();
  let reference = null;
  let pathToFile = null;

  useEffect(() => {
    getCurrentUser();

    getData('Users').then((users) => {
      console.log(users);
      setUsers(users);
      users.age != null && setSelectedAge(users.age);
      users.gender != null &&
        setSelectedGenderValue(
          users.gender === 'Male' ? 2 : users.gender === 'Female' ? 1 : 0
        );
      users.height != null && setSelectedHeight(users.height);
      users.weight != null && setSelectedWeight(users.weight);
      users.photo != null && setPhoto(users.photo);
    });
  }, []);

  const create = () => {
    console.log('users', users);
    console.log('email', email);

    let data = {
      id: users.id,
      nick: users.nick,
      name: users.name,
      surname: users.surname,
      age: null, //selectedAge,
      gender:
        selectedGenderValue === 2
          ? 'Male'
          : selectedGenderValue === 1
          ? 'Female'
          : '',
      height: selectedHeight,
      weight: selectedWeight,
      interestedIn: users.interestedIn,
      // photo: photo,
      geoCode: users.geoCode,
      city: users.city,
      county: users.county,
      country: users.country,
      createdTime: users.createdTime,
    };

    firestore()
      .collection('Users')
      .doc(email)
      .update(data)
      .then(() => {
        console.log('User updated!');
      });

      storage()
      .ref(imageName)
      .putFile(uploadUri)
      .then((snapshot) => {
        //You can check the image is now uploaded in the storage bucket
        console.log(`${imageName} has been successfully uploaded.`);
      })
      .catch((e) => console.log('uploading image error => ', e));

    storeData('Users', data);
    // try {
    //   console.log('yol', utils.FilePath.PICTURES_DIRECTORY);
    //   console.log('reference', photo);
    //   console.log('pathToFile', photo);
    //   const reference = storage().ref(
    //     '64F6FEC9-8776-492D-908A-078C2AEA02A3.jpg'
    //   );
    //   const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/64F6FEC9-8776-492D-908A-078C2AEA02A3.jpg`;
    //   // reference = storage().ref("/Users/tiban/Library/Developer/CoreSimulator/Devices/055E0022-99AE-4AB8-B52E-42A127E3B195/data/Containers/Data/Application/EB0ED1B5-055A-437E-8564-E2037B58FDEB/tmp/react-native-image-crop-picker/95B016A1-E997-4EE0-AF74-E1FB7D4CECBD.jpg");
    //   // pathToFile = `/Users/tiban/Library/Developer/CoreSimulator/Devices/055E0022-99AE-4AB8-B52E-42A127E3B195/data/Containers/Data/Application/EB0ED1B5-055A-437E-8564-E2037B58FDEB/tmp/react-native-image-crop-picker/95B016A1-E997-4EE0-AF74-E1FB7D4CECBD.jpg`;
    //   reference.putFile(pathToFile);
    // } catch (e) {
    //   console.error('ref', e);
    // }
  };

  const getCurrentUser = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    setEmail(currentUser?.user.email);
    onChangeFullName(
      currentUser?.user.givenName + ' ' + currentUser?.user.familyName
    );
  };

  const photoUpdate = () => {
    ImagePickerCropper.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        console.log('image', image);
        let uri = image.sourceURL;
        //generating image name
        let imageName = 'profile 1.jpeg';
        //to resolve file path issue on different platforms
        let uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        //setting the image name and image uri in the state

        setUploadUri(uploadUri);
        setImageName(imageName);

        setPhoto(image.path);
      })
      .catch((e) => {
        if (e.code === 'E_NO_IMAGE_DATA_FOUND') {
          Alert.alert('Warning', 'Selected photo must be png or jpeg format');
        }
        console.error('photo error', e.code);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={{ alignSelf: 'flex-end' }}
          onPress={() => create()}
        >
          <View style={styles.viewbuttonAction}>
            <Text style={styles.textButtonAction}>Save</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.viewImg}>
          <Image
            source={
              photo != ''
                ? { uri: photo }
                : require('assets/images/activities/profile.png')
            }
            // source={require(photoPath)}
            style={styles.image}
          />
          <View style={styles.viewIcon}>
            <Icon
              size={30}
              name="camera-outline"
              type="ionicon"
              onPress={() => photoUpdate()}
            />
          </View>
        </View>
        <View style={styles.viewInfo}>
          <View style={styles.viewFullName}>
            <Text style={styles.textFullName}>
              {polyglot.t('screens.create_profile.label.full_name')}
            </Text>
            <View style={styles.inputFullName}>
              <TextInput
                style={styles.inputNameText}
                onChangeText={onChangeFullName}
                editable={false}
                value={fullName}
              />
            </View>
          </View>

          <View style={styles.viewAgeGender}>
            <View style={styles.viewAge}>
              <Text style={styles.textAge}>
                {polyglot.t('screens.create_profile.label.age')}
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
                {polyglot.t('screens.create_profile.label.gender')}
              </Text>
              <Selector
                styleView={styles.selectorGender}
                onPress={() => genderActionSheetRef.current?.open()}
                // label={polyglot.t(
                //   'screens.create_profile.action_sheets.gender.title'
                // )}
                text={(() => {
                  const selectedGender = getSelectedGender(selectedGenderValue);
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
                {polyglot.t('screens.create_profile.label.height')}
              </Text>
              <Selector
                styleView={styles.selectorHeight}
                onPress={() => heightActionSheetRef.current?.open()}
                // label={polyglot.t(
                //   'screens.create_profile.action_sheets.height.title'
                // )}
                text={
                  selectedHeight[0] != null &&
                  selectedHeight[1] != null &&
                  `${selectedHeight[0]}.${selectedHeight[1]} m`
                }
              />
            </View>
            <View style={styles.viewWeight}>
              <Text style={styles.textWeight}>
                {polyglot.t('screens.create_profile.label.weight')}
              </Text>
              <Selector
                styleView={styles.selectorWeight}
                onPress={() => weightActionSheetRef.current?.open()}
                // label={polyglot.t(
                //   'screens.create_profile.action_sheets.weight.title'
                // )}
                text={
                  selectedWeight[0] != null &&
                  selectedWeight[1] != null &&
                  `${selectedWeight[0]}.${selectedWeight[1]} kg`
                }
              />
            </View>
          </View>

          <View style={styles.viewInterestedIn}>
            {/* <Text style={styles.textInterestedIn}>
              {polyglot.t('screens.create_profile.label.interested_in')}
            </Text>
            <ActivityTypeSelector>
              {activityTypes.map(
                (activityType: IActivityType, index: number) => (
                  <ActivityTypeSelector.IconItem
                    key={activityType.id}
                    id={activityType.id}
                    icon={activityType.image}
                    text={polyglot.t(activityType.textKey)}
                    onItemPress={(selecteActivityTypes: number[]) => {
                      console.log(selecteActivityTypes)
                      setBranchNo(selecteActivityTypes[0])
                    }}
                  />
                )
              )}
            </ActivityTypeSelector> */}
          </View>
          <View style={{ flex: 1 }} />
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
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateProfilScreen;

const styles = StyleSheet.create({
  viewImg: {
    flex: 1,
    paddingStart: '5%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  viewbuttonAction: {
    height: 40,
    width: 80,
    marginTop: 10,
    marginEnd: 10,
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
  image: {
    width: 140,
    height: 140,
    borderRadius: 75,
  },
  viewIcon: {
    alignSelf: 'flex-end',
    // backgroundColor: 'orange'
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
    backgroundColor: 'white',
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
  },
});
